const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    //   res.sendFile(path.join(rootDir, "views", "shop.html"));
    Product.fetchAll(products => {
        res.render("shop/product-list", {
            prods: products,
            // docTitle: "Shop",
            path: "/products",
            pageTitle: "All Products",
            // hasProducts: products.length > 0,
            // activeShop: true,
            // productCss: true    
            //layout: false // don't use main layout, special handlebars key, default = true
        });
    });
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("shop/index", {
            prods: products,
            // docTitle: "Shop",
            path: "/",
            pageTitle: "Shop",
            // hasProducts: products.length > 0,
            // activeShop: true,
            // productCss: true    
            //layout: false // don't use main layout, special handlebars key, default = true
        });
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart',{
        path: '/cart',
        pageTitle: 'Your cart',       
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your orders',       
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/cart',{
        path: '/checkout',
        pageTitle: 'Checkout cart',       
    })
}