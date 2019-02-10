const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "dev", "dev", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
