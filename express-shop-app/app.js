const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const authRoutes = require("./routes/auth");
// const mongoConnect = require("./util/db").mongoConnect;

//const handleBars = require("express-handlebars");
const MONGODB_URI = "mongodb://test:test@localhost:27017/development";

// const sequelize = require("./util/db");

const Product = require("./models/product");
const User = require("./models/user");

// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-items");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});
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
app.use(
  session({
    secret: "secrettext",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use("/", (req, res, next) => {
  console.log("Middleware always executes...");
  next(); // continue execution or send  a response
});

// reproduce a user since session
// is  not saving a mongoose user model
app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id).then(user => {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

// routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// routing error pages at the bottom
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(res => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "rodel",
          email: "emaii@sadf.com",
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
