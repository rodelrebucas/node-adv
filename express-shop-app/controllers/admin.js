const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageurl, price, description } = req.body;
  const product = new Product({ ...req.body, userId: req.user._id });
  product
    .save()
    .then(result => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
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
          editing: editMode,
          isAuthenticated: req.session.isLoggedIn
        });
      }
      res.redirect("/");
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // find products for specific user
  Product.find()
    // .select('title price -_id') // selecting columns to be included
    // .populate("userId") // getting all the data of the referenced userId
    .then(products => {
      res.render("admin/products", {
        prods: products,
        // docTitle: "Shop",
        path: "/admin/products",
        pageTitle: "Admin products",
        // hasProducts: products.length > 0,
        // activeShop: true,
        // productCss: true
        //layout: false // don't use main layout, special handlebars key, default = true
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageurl, price, description, id } = req.body;
  Product.findById(id)
    .then(product => {
      product.title = title;
      product.imageurl = imageurl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.findByIdAndRemove(id)
    .then(product => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};
