const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        // docTitle: "Shop",
        path: "/products",
        pageTitle: "All Products",
        isAuthenticated: req.session.isLoggedIn
        // hasProducts: products.length > 0,
        // activeShop: true,
        // productCss: true
        //layout: false // don't use main layout, special handlebars key, default = true
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId).then(product => {
    console.log("getProduct's callback execution start");
    console.log("product:", product);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: "Product Detail",
      path: "/products",
      isAuthenticated: req.session.isLoggedIn
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    // populate the reference
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const id = req.body.id;
  Product.findById(id)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }).then(orders => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your orders",
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/cart", {
    path: "/checkout",
    pageTitle: "Checkout cart",
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postDeleteCartItem = (req, res, next) => {
  const id = req.body.id;

  req.session.userremoveFromCart(id).then(() => {
    res.redirect("/cart");
  });
};

exports.postOrder = (req, res, next) => {
  req.session.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }; // get the full object
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => res.redirect("/orders"))
    .catch(err => console.log(err));

  // req.user
  //   .addOrder()
  //   .then(() => {
  //     res.redirect("/orders");
  //   })
  //   .catch(err => console.log(err));
};
