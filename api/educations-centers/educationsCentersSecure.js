let express = require('express');
let routes = express.Router();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sos:sos@sos1819-15dro-hqcpp.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, {useNewUrlParser: true});

var educationsCenters = [];
var apiKey = "abc1234";

client.connect(err => {
    educationsCenters = client.db("sos1819-15dro").collection("educationsCenter");
    console.log("Connected!");
});

routes.get("/educations-centers/loadInitialData", (req, res) => {

    let apikeyReq = req.query.apikey;

    if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
        res.sendStatus(401);
        return ;
    }

    addData();
    res.send("created")
});

routes.get("/educations-centers/docs", (req, res) => {

    let apikeyReq = req.query.apikey;

    if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
        res.sendStatus(401);
        return ;
    }

    res.redirect('https://documenter.getpostman.com/view/6901186/S17tRntf');
});

routes.get("/educations-centers", (req, res) => {

    let apikeyReq = req.query.apikey;

    if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
        res.sendStatus(401);
        return ;
    }

    let ownership = req.query.ownership;
    let limit = parseInt(req.query.limit, 10);
    let offset = parseInt(req.query.offset, 10);
    var myquery = {};
    if (typeof ownership !== 'undefined') {
        myquery = {ownership: ownership};
    }
    if (typeof limit === 'undefined') {
        limit = 10000;
    }
    if (typeof offset === 'undefined') {
        offset = 0;
    }


    educationsCenters.find(myquery).skip(offset).limit(limit).toArray((err, contactsArray) => {

        if (err)
            console.log("Error: " + err);

        res.send(contactsArray);
    });
});

routes.post("/educations-centers", (req, res) => {

    let apikeyReq = req.query.apikey;

    if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
        res.sendStatus(401);
        return ;
    }

    let newEducationCenter = req.body;

    educationsCenters.insert(newEducationCenter);

    res.sendStatus(201);
});

routes.delete("/educations-centers", (req, res) => {

    let apikeyReq = req.query.apikey;

    if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
        res.sendStatus(401);
        return ;
    }

    educationsCenters.deleteMany();

    res.sendStatus(200);
});

routes.get("/educations-centers/:id", (req, res) => {


    let apikeyReq = req.query.apikey;

    if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
        res.sendStatus(401);
        return ;
    }

    let id = req.params.id;

    educationsCenters.find({"id": parseInt(id)}).toArray((err, contactsArray) => {

        if (contactsArray.length == 1) {
            res.send(contactsArray[0]);
        } else {
            res.sendStatus(404);
        }
    });

});

routes.put("/educations-centers/:id", (req, res) => {

    let apikeyReq = req.query.apikey;

    if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
        res.sendStatus(401);
        return ;
    }

    let id = req.params.id;
    let updatedCenters = req.body;
    var myquery = {id: parseInt(id, 10)};

    educationsCenters.find({"id": parseInt(id)}).toArray((err, contactsArray) => {

        if (contactsArray.length == 1) {
            educationsCenters.replaceOne(myquery, updatedCenters, function (err, obj) {
                if (err) {
                    console.log("error: " + err);
                    res.sendStatus(404);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            res.sendStatus(404);
        }
    });


});

routes.delete("/educations-centers/:id", (req, res) => {

    let apikeyReq = req.query.apikey;

    if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
        res.sendStatus(401);
        return ;
    }

    let id = req.params.id;

    var myquery = {id: parseInt(id, 10)};

    educationsCenters.deleteOne(myquery, function (err, obj) {
        if (err) {
            res.sendStatus(404);
        } else {
            res.sendStatus(200);
        }
    });

});


routes.post("/educations-centers/:id", (req, res) => {
    res.sendStatus(405);
});

routes.put("/educations-centers", (req, res) => {
    res.sendStatus(405);
});

function addData() {

    educationsCenters.insertMany([{
        id: 1,
        country: "spain",
        center: "Centro Docente Privado",
        name: "Virgen Milagrosa",
        ownership: "Concertado",
        domicile: "Avda. Pino Montano  21-A",
        locality: "Sevilla",
        phone: 954355020,
        lat: 37.407326554,
        lon: -5.973891668,
        sports_education: 0,
        monthStart: 2
    }, {
        id: 2,
        country: "spain",
        center: "Colegio de Educación Infantil y Primaria",
        name: "Manuel Siurot",
        ownership: "Publico",
        domicile: "C/ El Real de la Jara  s/n. Bda. Villegas",
        locality: "Sevilla",
        phone: 955623540,
        lat: 37.411005222102375,
        lon: -5.974888801574707,
        sports_education: 0,
        monthStart: 6
    }, {
        id: 3,
        country: "spain",
        center: "Centro Docente Privado",
        name: "El Tobogán",
        ownership: "Privado",
        domicile: "C/ Virgen del Valle  38",
        locality: "Sevilla",
        phone: 954276212,
        lat: 37.37596064,
        lon: -5.998167749,
        sports_education: 1,
        monthStart: 1
    }, {
        id: 4,
        country: "spain",
        center: "Colegio de Educación Infantil y Primaria",
        name: "Centro de Estudios Sanitarios  Dr. Arduán",
        ownership: "Privado",
        domicile: "Avda. de Jerez  46",
        locality: "Sevilla",
        phone: 955623540,
        lat: 37.325442656,
        lon: -5.965175402,
        sports_education: 1,
        monthStart: 4
    }, {
        id: 5,
        country: "spain",
        center: "Centro de Educación Infantil",
        name: "Snoopy 8",
        ownership: "Privado",
        domicile: "C/ San Roque  6 y 8",
        locality: "Sevilla",
        phone: 954210595,
        lat: 37.3913194325946,
        lon: -5.99841846498611,
        sports_education: 0,
        monthStart: 9
    }
    ]);
}


module.exports = routes;