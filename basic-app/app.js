const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error")
//const handleBars = require("express-handlebars");

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

server.listen(5000);
