const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
    res.render("add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      pageTitle: "Add Product",
      activeAddProduct: true,
      productCss: true,
      formCss: true
    });
}

exports.postAddProduct = (req, res) => {
    console.log(req.body); // json format

    const product = new Product(req.body.title);
    product.save();

    res.redirect("/");
}

exports.getProducts = (req, res, next) => {
    //   res.sendFile(path.join(rootDir, "views", "shop.html"));
    Product.fetchAll(products => {
        res.render("shop", {
            prods: products,
            docTitle: "Shop",
            path: "/",
            pageTitle: "Shop",
            hasProducts: products.length > 0,
            activeShop: true,
            productCss: true
            //layout: false // don't use main layout, special handlebars key, default = true
        });
    });

}