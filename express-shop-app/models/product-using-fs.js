// Unused  - for reference only

const rootDir = require("../util/path");
const path = require("path");
const fs = require("fs");
const Cart = require("./cart");

const products = [];
const savePath = path.join(rootDir, "data", "products.json");

const getProductsFromFile = cb => {
  console.log("getProductFromFile start");
  fs.readFile(savePath, (err, fileContent) => {
    // async code - use callback to get results
    console.log("readFile's callback start...");
    if (err) {
      cb([]);
    } else {
      console.log("Execute readFile passed callback start");
      cb(JSON.parse(fileContent));
      console.log("Execute readFile passed callback end");
    }
    console.log("readFile's callback end..."); // executes later
  });
  console.log("getProductFromFile end"); // executes first
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(savePath, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
        console.log("existing...");
      } else {
        this.id = Math.random().toString();
        products.push(this);
        // overwrite file
        fs.writeFile(savePath, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    console.log("findById started..");
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      console.log("execute anonymous function: findByID's callback");
      cb(product);
    });
    console.log("findById done..");
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const filteredProducts = products.filter(product => product.id !== id);
      console.log(filteredProducts);
      fs.writeFile(savePath, JSON.stringify(filteredProducts), err => {
        // when you remove a product
        // we also need to remove the produt on the cart
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
        console.log(err);
      });
    });
  }
};
