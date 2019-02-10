const Product = require("../models/product");
const Cart = require("../models/cart");

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
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const filterProds = products.filter(prod =>
        cart.products.find(cartProd => cartProd.id === prod.id)
      );
      const cartProds = [];
      for (product of products) {
        const cartProdData = cart.products.find(prod => prod.id === product.id)
        if (cartProdData) {
          cartProds.push({product: product, qty: cartProdData.qty})
        }
      }

      res.render("shop/cart", {
        cartProductData: cartProds,
        path: "/cart",
        pageTitle: "Your cart"
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const id = req.body.id;

  Product.findById(id, product => {
    Cart.addProduct(id, product.price);
  });
  res.redirect("/cart");
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
  const id = req.body.id
  Product.findById(id, product => {
    Cart.deleteProduct(id, product.price);
    res.redirect("/cart");
  })
}