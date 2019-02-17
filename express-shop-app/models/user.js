const mongodb = require("mongodb");
const getDb = require("../util/db").getDb;

const ObjectId = mongodb.ObjectId;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // find product inside user's cart
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQty = 1;
    const updatedCartItems = [...this.cart.items];
    // if an index exist
    if (cartProductIndex >= 0) {
      newQty = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQty;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQty });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  getCart() {
    const db = getDb();
    // get all product ids on this cart
    // since this is all references
    const prodIds = this.cart.items.map(i => i.productId);
    // find all products with all these ids
    return db
      .collection("products")
      .find({ _id: { $in: prodIds } })
      .toArray()
      .then(products => {
        // create an array of objects
        return products.map(p => {
          return {
            ...p,
            // get the products's quantity by accessing the cart
            // of this object, which is the user
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        });
      });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      product => product.productId.toString() !== productId
    );
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name
          }
        };
        return db.collection("orders").insertOne(order);
      })
      .then(() => {
        // empty cart fot this instance
        this.cart = { items: [] };
        // empty cart in the db
        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": this._id })
      .toArray();
  }
}

module.exports = User;
