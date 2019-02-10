const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  Product.create({ ...req.body, userId: req.user.id })
    .then(result => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const id = req.params.id;
  req.user
    .getProducts({ where: { id: id } })
    .then(product => {
      if (product) {  
        return res.render("admin/edit-product", {
          product: product[0],
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode
        });
      }
      res.redirect("/");
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // find products for specific user
  req.user.getProducts()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        // docTitle: "Shop",
        path: "/admin/products",
        pageTitle: "Admin products"
        // hasProducts: products.length > 0,
        // activeShop: true,
        // productCss: true
        //layout: false // don't use main layout, special handlebars key, default = true
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  Product.findById(req.body.id)
    .then(product => {
      console.log(product);
      product.title = req.body.title;
      product.imageUrl = req.body.imageUrl;
      product.price = +req.body.price;
      product.desecription = req.body.description;
      return product.save();
    })
    .then(result => {
      console.log("updated");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.findById(id)
    .then(product => {
      return product.destroy();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};
