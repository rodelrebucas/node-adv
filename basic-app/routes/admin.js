const express = require("express");
const path = require("path");

const router = express.Router();

const rootDir = require("../util/path");

const products = [];

router.get("/add-product", (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    pageTitle: "Add Product",
    activeAddProduct: true,
    productCss: true,
    formCss: true
  });
});
router.post("/add-product", (req, res) => {
  console.log(req.body); // json format
  products.push({ title: req.body.title });
  res.redirect("/");
});

// module.exports = router;
exports.routes = router;
exports.products = products;
