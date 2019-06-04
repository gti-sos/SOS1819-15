require('dotenv').config();
var express = require("express");
var sportsAPI = require("./sports-api");
var bodyParse = require("body-parser");

var app = express();
var port = process.env.PORT || 8080;
const BASE_PATH = "/api";

const PABLO_MONGO_URI = process.env.PABLO_MONGO_URI;
const PABLO_MONGO_USER = process.env.PABLO_MONGO_USER;
const PABLO_MONGO_PASS = process.env.PABLO_MONGO_PASS;
const URI = "mongodb+srv://" + PABLO_MONGO_USER + ":" + PABLO_MONGO_PASS + "@" + PABLO_MONGO_URI;

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

sportsAPI.educationsCentersv2(app, BASE_PATH);
sportsAPI.educationsCentersSecurev2(app, BASE_PATH);

app.use("/proxy", require('./sports-api/externalRoutes.js'));
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
        client = new MongoClient(URI, {useNewUrlParser: true});

        client.connect(err => {
            console.log("3rd db Connected!");
            app.listen(port, () => {
                 console.log("Server running on port "+ port);
            });
        });
    });
});