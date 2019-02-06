const express = require("express");
const path = require("path");

const router = express.Router();

const rootDir = require("../util/path");

const adminRoutes = require("./admin");

router.get("/", (req, res, next) => {
  console.log(adminRoutes.products);
  //   res.sendFile(path.join(rootDir, "views", "shop.html"));
  const products = adminRoutes.products;
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

module.exports = router;
