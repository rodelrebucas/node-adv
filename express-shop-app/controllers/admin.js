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
  const {title, imageurl, price, description} = req.body;
  const product = new Product(title, imageurl, price, description, null, req.user._id)
  product
    .save()
    .then(result => {
      console.log(result);
      res.redirect("/admin/products");
    })
};

exports.getEditProduct = (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const id = req.params.id;
  Product.findById(id)
    .then(product => {
      if (product) {  
        return res.render("admin/edit-product", {
          product: product,
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
  Product.fetchAll()
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
  const {title, imageurl, price, description, id} = req.body;
  const product = new Product(title, imageurl, price, description, id)
  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
    })
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.deleteById(id)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
