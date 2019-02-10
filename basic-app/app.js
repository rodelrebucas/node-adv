const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
//const handleBars = require("express-handlebars");

const sequelize = require("./util/db");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

// set global config
// app.engine(
//   "hbs",
//   handleBars({
//     layoutsDir: "views/layouts",
//     defaultLayout: "main-layout",
//     extname: "hbs"
//   })
// );
app.set("view engine", "ejs"); // set template engine
app.set("views", "views"); // set path to views; default views

// using middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //allow access to static files

// attach  a user in the request
app.use((req, res, next) => {
  User.findById(1)
    .then(user => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(err => console.log(err));
});

app.use("/", (req, res, next) => {
  console.log("Middleware always executes...");
  next(); // continue execution or send  a response
});

// routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// routing error pages at the bottom
app.use(errorController.get404);

const server = http.createServer(app);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); // optional
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  .sync({ force: true }) // overwrite , for dev purposes
  .then(res => {
    // console.log(res);
    // create a dummy user
    return User.findById(1);
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: "dev",
        email: "dev@gmail.com"
      });
    }
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(user => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
