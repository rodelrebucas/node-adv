const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  console.log(req);
  //   res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      prods: products,
      // docTitle: "Shop",
      path: "/products",
      pageTitle: "All Products"
      // hasProducts: products.length > 0,
      // activeShop: true,
      // productCss: true
      //layout: false // don't use main layout, special handlebars key, default = true
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId, product => {
      console.log("getProduct's callback execution start")
      console.log("product:", product)
    res.render("shop/product-detail", {
      product: product,
      pageTitle: "Product Detail",
      path:"/products"
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      // docTitle: "Shop",
      path: "/",
      pageTitle: "Shop"
      // hasProducts: products.length > 0,
      // activeShop: true,
      // productCss: true
      //layout: false // don't use main layout, special handlebars key, default = true
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your cart"
  });
};

exports.postCard = (req, res, next) => {
    const id = req.body.id;
    res.redirect("/cart");
}

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your orders"
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/cart", {
    path: "/checkout",
    pageTitle: "Checkout cart"
  });
};
