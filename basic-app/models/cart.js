const fs = require("fs");
const path = require("path")
const rootPath = require("../util/path");
const dataPath = path.join(rootPath, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, price) {
    fs.readFile(dataPath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSOn.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct }; // copy product
        updatedProduct.qty = updatedProduct.qty + 1; // update
        cart.products[existingProductIndex] = updatedProduct; // assign
      } else {
        updatedProduct = { id: id, qty: 1 }; // create new entry
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + price;
      fs.writeFile(dataPath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }
};
