// *Note: Unused file. For reference purposes only

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

let _db;

const mongoConnect = callback => {
  
  MongoClient.connect("mongodb://test:test@localhost:27017/development")
    .then(client => {
      console.log("Connected to db!..")
      _db = client.db();
      callback();
    })
    .catch(err => console.log(err))
}

getDb = () => {
  if (_db) {
    return _db
  }
  throw("No db connected...")
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;