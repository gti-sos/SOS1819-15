const MongoClient = require('mongodb').MongoClient;

const mongoURI = process.env.pabloMongoURI;
const mongoUSER = process.env.pabloMongoUser;
const mongoPASS = process.env.pabloMongoPass;
const pabloDBCollection = process.env.PabloDBCollectionAPI;
const pabloDBName = process.env.pabloDBName;
const URI = "mongodb+srv://" + mongoUSER + ":" + mongoPASS + "@" + mongoURI;
const client = new MongoClient(URI, { useNewUrlParser: true });

var User = require('./users/User');
var users = [];

client.connect(err => {
    sportsCompetitions = client.db(pabloDBName).collection(pabloDBCollection);
    console.log("Connected to db!");
});

module.exports = function (app, BASE_PATH) {

}