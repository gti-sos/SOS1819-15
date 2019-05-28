var express = require("express");
var sportsAPI = require("./sports-api");
let bodyParse = require("body-parser");

var app = express();
var port = process.env.PORT || 8080;
const BASE_PATH = "/api";

const mongoURI = process.env.pabloMongoURI;
const mongoUSER = process.env.pabloMongoUser;
const mongoPASS = process.env.pabloMongoPass;
const pabloDBCollection = process.env.PabloDBCollectionAPI;
const pabloDBName = process.env.pabloDBName;

app.use(bodyParse.json());

// API v1
sportsAPI.sportsCompetitions(app, BASE_PATH);
sportsAPI.sportsCompetitionsSecure(app, BASE_PATH);

sportsAPI.educationsCenters(app, BASE_PATH);
sportsAPI.educationsCentersSecure(app, BASE_PATH);

sportsAPI.sportsCenters(app, BASE_PATH);
sportsAPI.sportsCentersSecure(app, BASE_PATH);

// API V2
sportsAPI.sportsCompetitionsv2(app, BASE_PATH);
sportsAPI.sportsCompetitionsSecurev2(app, BASE_PATH);

// API V3
sportsAPI.sportsCompetitionsv3(app, BASE_PATH);
sportsAPI.sportsCompetitionsSecurev3(app, BASE_PATH);

app.use("/", express.static(__dirname + "/public"));
/*
/* MongoDB connections
*/
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://sos:sos@sos1819-15dro-hqcpp.mongodb.net/test?retryWrites=true";
var client = new MongoClient(uri, {useNewUrlParser: true});

client.connect(err => {
    console.log("1st db Connected!");
    
    uri = "mongodb+srv://juanlu:3636jlgD@sos1819jlgd-wayhl.mongodb.net/test?retryWrites=true";
    client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        console.log("2nd db Connected!");
        const URI = "mongodb+srv://" + mongoUSER + ":" + mongoPASS + "@" + mongoURI;
        client = new MongoClient(URI, {useNewUrlParser: true});

        client.connect(err => {
            console.log("3rd db Connected!");
            app.listen(port, () => {
                 console.log("Server running on port "+ port);
            });
        });
    });
});