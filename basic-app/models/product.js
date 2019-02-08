const rootDir = require("../util/path");
const path = require("path");
const fs = require("fs");

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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      // overwrite file
      fs.writeFile(savePath, JSON.stringify(products), err => {
        console.log(err);
      });
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
};
