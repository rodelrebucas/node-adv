const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
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
      path: "/products"
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const id = req.body.id;
  let fetchedCart;
  let qty = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: id } }); // get product in the user's cart if exist
    })
    .then(products => {
      // checkif product exist in user's cart
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        // update qty
        const oldQty = product.cartItem.quantity;
        qty = oldQty + 1;
        return product;
      } else {
        res.redirect("/cart");
      }
      return Product.findById(id);
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: qty } });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

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

exports.postDeleteCartItem = (req, res, next) => {
  const id = req.body.id;

  req.user.getCart().then(cart => {
    return cart.getProducts({ where: { id: id } });
  })
  .then(prods => {
    const product = prods[0];
    return product.cartItem.destroy();
  })
  .then(()=>{
    res.redirect("/cart");
  });
};
