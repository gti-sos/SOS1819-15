var express = require("express");
var sportsAPI = require("./sports-api");

var app = express();

const BASE_PATH = "/api"

sportsAPI.sportsCompetitions(app, BASE_PATH);

var port = process.env.PORT || 8080;

app.use("/",express.static(__dirname+"/public"));

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
        
        uri = "mongodb+srv://dbPablo:sossos@cluster0-s3eqj.mongodb.net/test?retryWrites=true";
        client = new MongoClient(uri, {useNewUrlParser: true});
        
        client.connect(err => {
            console.log("3rd db Connected!");
            app.listen(port, () => {
                 console.log("Server running on port "+ port)
            });
        });
    });
});

