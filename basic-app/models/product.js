const rootDir = require('../util/path');
const path = require('path');
const fs = require('fs');

const products = []
const savePath = path.join(rootDir, "data", "products.json");

const getProductsFromFile = cb => {
    fs.readFile(savePath, (err, fileContent)=> { // async code - use callback get results
        if (err) {
            cb([])
        } else {
            cb(JSON.parse(fileContent));  
        }
    })
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;   
    }

    save() {
        getProductsFromFile(products => {    
            products.push(this);
            // overwrite file
            fs.writeFile(savePath, JSON.stringify(products), err => {
                console.log(err);
            })
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }
       
}