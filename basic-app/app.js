const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

// using middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", (req, res, next) => {
  console.log("Middleware always executes...");
  next(); // continue execution or send  a response
});

// routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// routing error pages at the bottom
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

const server = http.createServer(app);

server.listen(5000);
