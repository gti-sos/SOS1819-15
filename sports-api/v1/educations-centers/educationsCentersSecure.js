const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sos:sos@sos1819-15dro-hqcpp.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, {useNewUrlParser: true});

var educationsCenters = [];
var apiKey = "abc1234";

client.connect(err => {
    educationsCenters = client.db("sos1819-15dro").collection("educationsCenter");
    console.log("Connected!");
});

module.exports = function (app, BASE_PATH) {

    var path;

    path = BASE_PATH + "/educations-centers/loadInitialData";
    app.get(path, (req, res) => {

        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }

        educationsCenters.find().toArray((err, contactsArray) => {
            if (contactsArray.length !== 0) {
                res.sendStatus(409);
                return;
            } else {
                addData();
                res.send("created")
            }

            if (err)
                console.log("Error: " + err);
        });
    });

    path = BASE_PATH + "/educations-centers/docs";
    app.get(path, (req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return ;
        }
        res.redirect('https://documenter.getpostman.com/view/6901186/S17tS8XH');
    });

    path = BASE_PATH + "/educations-centers";
    app.get(path, (req, res) => {

        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return ;
        }

        let ownership = req.query.ownership;
        let country = req.query.country;
        let center = req.query.center;
        let name = req.query.name;
        let domicile = req.query.domicile;
        let locality = req.query.locality;
        let phone = req.query.phone;
        let lat = req.query.lat;
        let lon = req.query.lon;
        let sports_education = req.query.sports_education;
        let monthStart = req.query.monthStart;

        let limit = parseInt(req.query.limit, 10);
        let offset = parseInt(req.query.offset, 10);
        let myquery = {};

        if (typeof ownership !== 'undefined') {
            myquery.ownership = ownership;
        }
        if (typeof country !== 'undefined') {
            myquery.country = country;
        }
        if (typeof center !== 'undefined') {
            myquery.center = center
        }
        if (typeof name !== 'undefined') {
            myquery.name = name
        }
        if (typeof domicile !== 'undefined') {
            myquery.domicile = domicile
        }
        if (typeof phone !== 'undefined') {
            myquery.phone = parseInt(phone);
        }
        if (typeof locality !== 'undefined') {
            myquery.locality = locality
        }
        if (typeof lat !== 'undefined') {
            myquery.lat = parseFloat(lat);
        }
        if (typeof lon !== 'undefined') {
            myquery.lon = parseFloat(lon);
        }
        if (typeof sports_education !== 'undefined') {
            myquery.sports_education = parseInt(sports_education);
        }
        if (typeof monthStart !== 'undefined') {
            myquery.monthStart = parseInt(monthStart);
        }

        if (typeof limit === 'undefined') {
            limit = 10000;
        }
        if (typeof offset === 'undefined') {
            offset = 0;
        }

        console.log("Query: " + JSON.stringify(myquery));
        educationsCenters.find(myquery).project({_id: 0}).skip(offset).limit(limit).toArray((err, contactsArray) => {

            if (err)
                console.log("Error: " + err);

            res.send(contactsArray);
        });
    });

    path = BASE_PATH + "/educations-centers";
    app.post(path, (req, res) => {

        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return ;
        }

        let newEducationCenter = req.body;
        let id = parseInt(newEducationCenter.id, 10);

        if (!validation(newEducationCenter)) {
            res.sendStatus(400);
            return;
        }

        educationsCenters.find({"id": parseInt(id)}).toArray((err, contactsArray) => {

            if (contactsArray.length == 0) {
                educationsCenters.insertOne(newEducationCenter);

                res.sendStatus(201);
            } else {
                res.sendStatus(409);
            }
        });


    });

    path = BASE_PATH + "/educations-centers";
    app.delete(path, (req, res) => {

        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return ;
        }
        educationsCenters.deleteMany();

        res.sendStatus(200);
    });

    path = BASE_PATH + "/educations-centers/:id";
    app.get(path, (req, res) => {

        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return ;
        }

        let id = req.params.id;

        educationsCenters.find({"id": parseInt(id)}).project({_id: 0}).toArray((err, contactsArray) => {

            if (contactsArray.length > 0) {
                res.send(contactsArray[0]);
            } else {
                res.sendStatus(404);
            }
        });

    });

    path = BASE_PATH + "/educations-centers/:id";
    app.put(path, (req, res) => {

        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return ;
        }

        let id = req.params.id;
        let updatedCenters = req.body;
        var myquery = {id: parseInt(id, 10)};

        if (parseInt(id, 10) !== parseInt(updatedCenters.id, 10)) {
            res.sendStatus(400);
            return;
        }

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

    path = BASE_PATH + "/educations-centers/:id";
    app.delete(path, (req, res) => {

        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return ;
        }

        let id = req.params.id;

        var myquery = {id: parseInt(id, 10)};

        educationsCenters.find({"id": parseInt(id)}).toArray((err, contactsArray) => {

            if (contactsArray.length > 0) {
                educationsCenters.deleteOne(myquery, function (err, obj) {
                    if (err) {
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


    path = BASE_PATH + "/educations-centers/:id";
    app.post(path, (req, res) => {

        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return ;
        }

        res.sendStatus(405);
    });

    path = BASE_PATH + "/educations-centers";
    app.put(path, (req, res) => {

        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return ;
        }

        res.sendStatus(405);
    });
};

function validation(newCompetitions) {
    let r = false;
    if (newCompetitions.hasOwnProperty("id") &&
        newCompetitions.hasOwnProperty("country") &&
        newCompetitions.hasOwnProperty("center") &&
        newCompetitions.hasOwnProperty("name") &&
        newCompetitions.hasOwnProperty("ownership") &&
        newCompetitions.hasOwnProperty("domicile") &&
        newCompetitions.hasOwnProperty("locality") &&
        newCompetitions.hasOwnProperty("phone") &&
        newCompetitions.hasOwnProperty("lat") &&
        newCompetitions.hasOwnProperty("lon") &&
        newCompetitions.hasOwnProperty("sports_education") &&
        newCompetitions.hasOwnProperty("monthStart")) {
        r = true;
    }
    return r;
}

function addData() {

    educationsCenters.deleteMany();

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