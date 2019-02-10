const Product = require("../models/product-using-fs");

exports.getAddProduct = (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  console.log(req.body); // json format

  const { title, imageUrl, description, price } = req.body;
  const product = new Product(null, title, imageUrl, description, +price);
  product.save();

  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const id = req.params.id;
  //   http://localhost:5000/admin/edit-product/0.4595875559514486?edit=true
  Product.findById(id, product => {
    if (product) {
      return res.render("admin/edit-product", {
        product: product,
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode
      });
    }
    res.redirect("/");
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
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
  });
};

exports.postEditProduct = (req, res, next) => {
  console.log(req.body);
  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = +req.body.price;
  console.log(price);
  const desc = req.body.description;
  console.log(id);
  const updatedProduct = new Product(id, title, imageUrl, desc, price);
  console.log(updatedProduct);
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.deleteById(id);
  res.redirect("/admin/products");
};
