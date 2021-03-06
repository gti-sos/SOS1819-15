const MongoClient = require('mongodb').MongoClient;
const apiKey = "gbbzajbw";

const PABLO_MONGO_URI = process.env.PABLO_MONGO_URI;
const PABLO_MONGO_USER = process.env.PABLO_MONGO_USER;
const PABLO_MONGO_PASS = process.env.PABLO_MONGO_PASS;
const PABLO_DB_COLLECTION_API = process.env.PABLO_DB_COLLECTION_API;

const PABLO_DB_NAME = process.env.PABLO_DB_NAME;
const URI = "mongodb+srv://" + PABLO_MONGO_USER + ":" + PABLO_MONGO_PASS + "@" + PABLO_MONGO_URI;

const client = new MongoClient(URI, {useNewUrlParser: true});

var cors = require("cors");
var whitelist = ['https://sos1819-06.herokuapp.com/#!/', 'https://sos1819-12.herokuapp.com/#!/'];
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
};

var sportsCompetitions = [];

client.connect(err => {
    sportsCompetitions = client.db(PABLO_DB_NAME).collection(PABLO_DB_COLLECTION_API);
    console.log("Connected to sos1819-pfs!");
});

module.exports = function (app, BASE_PATH) {
    console.log("Registering sportsAPI (v2): sports-competitions.");
    var path = "";

    console.log("Registering redirection to docs");
    path = BASE_PATH + "/sports-competitions/docs";
    console.log("LOG " + path);
    app.get(path, cors(corsOptionsDelegate), (req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        res.redirect('https://documenter.getpostman.com/view/6897422/S17tRoGk');
    });

    console.log("Registering get /sports-competitions/loadInitialData");
    path = BASE_PATH + "/sports-competitions/loadInitialData";
    app.get(path, cors(corsOptionsDelegate), (req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        sportsCompetitions.find().toArray((err, competitionArray) => {
            if (competitionArray.length > 0) {
                res.sendStatus(409);
            } else {
                addData();
                res.sendStatus(201);
            }
        });
    });
    console.log("Resource /sports-competitions/loadInitialData registered");

    console.log("Registering get /sports-competitions/");
    path = BASE_PATH + "/sports-competitions";
    app.get(path, cors(corsOptionsDelegate),(req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }

        let limit = parseInt(req.query.limit, 10);
        let offset = parseInt(req.query.offset, 10);
        let myquery = {};

        let year = req.query.year;
        let month = req.query.month;
        let day = req.query.day;
        let name = req.query.name;
        let sportcenter = req.query.sportcenter;
        let schoolcenter = req.query.schoolcenter;
        let activity = req.query.activity;
        let lengthactivity = req.query.lengthactivity;
        let totaldistance = req.query.totaldistance;
        let inscriptionprice = req.query.inscriptionprice;
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;

        let fromMonth = req.query.fromMonth;
        let toMonth = req.query.toMonth;

        if (typeof year !== 'undefined') {
            myquery.year = parseInt(year, 10);
        }
        if (typeof month !== 'undefined') {
            myquery.month = parseInt(month, 10);
        }
        if (typeof day !== 'undefined') {
            myquery.day = parseInt(year, 10);
        }
        if (typeof name !== 'undefined') {
            myquery.name = name;
        }
        if (typeof sportcenter !== 'undefined') {
            myquery.sportcenter = sportcenter;
        }
        if (typeof schoolcenter !== 'undefined') {
            myquery.schoolcenter = schoolcenter;
        }
        if (typeof activity !== 'undefined') {
            myquery.activity = activity;
        }
        if (typeof lengthactivity !== 'undefined') {
            myquery.lengthactivity = parseInt(lengthactivity, 10);
        }
        if (typeof totaldistance !== 'undefined') {
            myquery.totaldistance = parseInt(totaldistance, 10);
        }
        if (typeof inscriptionprice !== 'undefined') {
            myquery.inscriptionprice = parseInt(inscriptionprice, 10);
        }
        if (typeof latitude !== 'undefined') {
            myquery.latitude = parseFloat(latitude);
        }
        if (typeof longitude !== 'undefined') {
            myquery.lon = parseFloat(longitude);
        }
        if (typeof limit === 'undefined') {
            limit = 10000;
        }
        if (typeof offset === 'undefined') {
            offset = 0;
        }

        sportsCompetitions.find(myquery, {projection: {_id: 0}}).skip(offset).limit(limit).toArray((err, competitionArray) => {
            if (err) console.log("Error: " + err);
            var filteredCompetitions = competitionArray;
            if (!isNaN(fromMonth) && typeof fromMonth !== 'undefined' && typeof fromMonth !== 'null') {
                fromMonth = parseInt(fromMonth, 10);
                filteredCompetitions = competitionArray
                    .filter((comp) => {
                        return (comp.month >= fromMonth);
                    });
            }
            if (toMonth >= fromMonth && !isNaN(toMonth) && typeof toMonth !== 'undefined' && typeof toMonth !== 'null') {
                toMonth = parseInt(toMonth, 10);
                filteredCompetitions = filteredCompetitions
                    .filter((comp) => {
                        return (comp.month <= toMonth);
                    });
            }
            res.send(filteredCompetitions);
        });
    });
    console.log("Resource /sports-competitions/ registered");

    path = BASE_PATH + "/sports-competitions";
    app.post(path, cors(corsOptionsDelegate), (req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        let newCompetitions = req.body;

        if (validation(newCompetitions)) {
            sportsCompetitions.find({"id": parseInt(newCompetitions.id)}, {projection: {_id: 0}}).toArray((err, competitionArray) => {

                if (competitionArray.length < 1) {
                    sportsCompetitions.insertOne(newCompetitions);
                    res.sendStatus(201);
                } else {
                    res.sendStatus(409);
                }
            });
        } else {
            res.sendStatus(400);
        }
    });

    console.log("Registering delete to /sports-competitions");
    path = BASE_PATH + "/sports-competitions";
    app.delete(path, cors(corsOptionsDelegate),(req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        sportsCompetitions.deleteMany();
        res.sendStatus(200);
    });

    console.log("Registering get to /sports-competitions/:id");
    path = BASE_PATH + "/sports-competitions/:id";
    app.get(path, cors(corsOptionsDelegate),(req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        let id = req.params.id;

        sportsCompetitions.find({"id": parseInt(id)}, {projection: {_id: 0}}).toArray((err, competitionArray) => {
            if (competitionArray.length == 1) {
                res.send(competitionArray[0]);
            } else {
                res.sendStatus(404);
            }
        });
    });

    console.log("Registering get to /sports-competitions/:year/:month");
    path = BASE_PATH + "/sports-competitions/:year/:month";
    app.get(path, cors(corsOptionsDelegate),(req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        var year = req.params.year;
        var month = req.params.month;

        sportsCompetitions.find({
            "year": parseInt(year),
            "month": parseInt(month)
        }, {projection: {_id: 0}}).toArray((err, competitionArray) => {

            if (competitionArray.length > 0) {
                if (competitionArray.length == 1) {
                    res.send(competitionArray[0]);
                } else {
                    res.send(competitionArray);
                }
            } else {
                res.sendStatus(404);
            }
        });
    });

    console.log("Registering put to /sports-competitions/:id");
    path = BASE_PATH + "/sports-competitions/:id";
    app.put(path, cors(corsOptionsDelegate),(req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        let id = req.params.id;
        let updatedCompetition = req.body;

        var myquery = {id: parseInt(id, 10)};

        if (!validation(updatedCompetition)) {
            res.sendStatus(400);
            return;
        }

        sportsCompetitions.find({"id": parseInt(id)}, {projection: {_id: 0}}).toArray((err, competitionArray) => {
            if (competitionArray.length == 1) {
                if (competitionArray[0].id == parseInt(updatedCompetition.id)) {
                    sportsCompetitions.replaceOne(myquery, updatedCompetition, function (err, obj) {
                        if (err) {
                            console.log("error: " + err);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(200);
                        }
                    });
                } else {
                    res.sendStatus(400)
                }
            } else {
                res.sendStatus(404);
            }
        });
    });

    console.log("Registering delete to /sports-competitions/:id");
    path = BASE_PATH + "/sports-competitions/:id";
    app.delete(path, cors(corsOptionsDelegate),(req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        let id = req.params.id;
        var myquery = {id: parseInt(id, 10)};

        sportsCompetitions.deleteOne(myquery, function (err, obj) {
            if (err) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        });
    });

    console.log("Registering post to /sports-competitions/:id");
    path = BASE_PATH + "/sports-competitions/:id";
    app.post(path, cors(corsOptionsDelegate),(req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        res.sendStatus(405);
    });

    console.log("Registering put to /sports-competitions");
    path = BASE_PATH + "/sports-competitions";
    app.put(path, cors(corsOptionsDelegate),(req, res) => {
        let apikeyReq = req.query.apikey;

        if (typeof apikeyReq === 'undefined' || apikeyReq !== apiKey) {
            res.sendStatus(401);
            return;
        }
        res.sendStatus(405);
    });

    console.log("sports-competitions (v2) registered");
}

function validation(newCompetitions) {
    let r = false;
    if (newCompetitions.hasOwnProperty("id") &&
        newCompetitions.hasOwnProperty("day") &&
        newCompetitions.hasOwnProperty("year") &&
        newCompetitions.hasOwnProperty("month") &&
        newCompetitions.hasOwnProperty("name") &&
        newCompetitions.hasOwnProperty("sportcenter") &&
        newCompetitions.hasOwnProperty("schoolcenter") &&
        newCompetitions.hasOwnProperty("activity") &&
        newCompetitions.hasOwnProperty("lengthactivity") &&
        newCompetitions.hasOwnProperty("totaldistance") &&
        newCompetitions.hasOwnProperty("inscriptionprice") &&
        newCompetitions.hasOwnProperty("latitude") &&
        newCompetitions.hasOwnProperty("longitude")) {
        if (typeof newCompetitions.year !== 'undefined' &&
            typeof newCompetitions.year !== 'month' &&
            typeof newCompetitions.year !== 'day') {
            r = true;
        }
    }
    return r;
}

function addData() {
    sportsCompetitions.insertMany([
        {
            id: 1,
            year: 2019,
            day: 4,
            month: 4,
            name: "V encuentro escolar y deportivo (programa distrito: macarena - norte)",
            sportcenter: "",
            schoolcenter: "Centro virgen milagrosa",
            activity: "Escolar",
            lengthactivity: 6,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.407737,
            longitude: -5.973819
        },
        {
            id: 2,
            year: 2019,
            day: 23,
            month: 3,
            name: "Campeonato de andalucía de taekwondo, categoría promesas",
            sportcenter: "C.D. Hytasa",
            schoolcenter: "",
            activity: "Artes marciales",
            lengthactivity: 6,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.370960,
            longitude: -5.961155
        },
        {
            id: 3,
            year: 2019,
            day: 4,
            month: 4,
            name: "Mini olimpiada escolar distrito Cerro-Amate",
            sportcenter: "C.D. Hytasa",
            schoolcenter: "",
            activity: "Escolar",
            lengthactivity: 6,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.370960,
            longitude: -5.961155
        },
        {
            id: 4,
            year: 2019,
            day: 4,
            month: 4,
            name: "Encuentro Escolar y Deportivo (Programa Distrito: Macarena - Norte)",
            sportcenter: "",
            schoolcenter: "CEIP Manuel Siurot",
            activity: "Escolar",
            lengthactivity: 6,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.411400,
            longitude: -5.974815
        },
        {
            id: 5,
            year: 2019,
            day: 19,
            month: 5,
            name: "Carrera popular y escolar Paque de Miraflores",
            sportcenter: "Parque de Miraflores",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 3,
            totaldistance: 10,
            inscriptionprice: 0,
            latitude: 37.411110,
            longitude: -5.963570
        },
        {
            id: 6,
            year: 2019,
            day: 23,
            month: 5,
            name: "Miniolimpiada escolar",
            sportcenter: "C.D. Vega de Triana",
            schoolcenter: "",
            activity: "Escolar",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.382959,
            longitude: -6.014996

        },
        {
            id: 7,
            year: 2019,
            day: 25,
            month: 5,
            name: "Campeonato de Andalucía de Natación de Aguas Abiertas",
            sportcenter: "CEAR Isla de la Cartuja",
            schoolcenter: "",
            activity: "Natación",
            lengthactivity: 10,
            totaldistance: 12.5,
            inscriptionprice: 0,
            latitude: 37.410954,
            longitude: -5.993353
        },
        {
            id: 8,
            year: 2019,
            day: 31,
            month: 5,
            name: "Olimpiadas Escolares (Distrito Bellavista)",
            sportcenter: "C.D. Bellavista",
            schoolcenter: "",
            activity: "Escolar",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.322956,
            longitude: -5.973466
        },
        {
            id: 9,
            year: 2019,
            day: 1,
            month: 6,
            name: "Vive la Alameda",
            sportcenter: "",
            schoolcenter: "",
            activity: "Escolar",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.399058,
            longitude: -5.993644
        },
        {
            id: 10,
            year: 2019,
            day: 1,
            month: 6,
            name: "Velada Promoción Jovenes Promesas del Kick Boxing",
            sportcenter: "C.D. Alcosa",
            schoolcenter: "",
            activity: "Artes Marciales",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.413987,
            longitude: -5.928280
        },
        {
            id: 11,
            year: 2019,
            day: 8,
            month: 6,
            name: "Encuentro Deportivo De Mayores (programa Distrito: Nervión San Pablo)",
            sportcenter: "C.D. El paragüas",
            schoolcenter: "",
            activity: "3era Edad",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.383631,
            longitude: -6.007406
        },
        {
            id: 12,
            year: 2019,
            day: 9,
            month: 6,
            name: "Carrera Popular y Escolar, Parque María Luisa",
            sportcenter: "Parque María Luisa",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 4,
            totaldistance: 10,
            inscriptionprice: 0,
            latitude: 37.374946,
            longitude: -5.988715
        },
        {
            id: 13,
            year: 2019,
            day: 9,
            month: 6,
            name: "Vive El Deporte En Torreblanca (programa Distrito: Este)",
            sportcenter: "Boulevard de Torreblanca",
            schoolcenter: "",
            activity: "Otros",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.380636,
            longitude: -5.910138
        },
        {
            id: 14,
            year: 2019,
            day: 15,
            month: 6,
            name: "Día Del Patín (programa Distrito: Casco Antiguo)",
            sportcenter: "CD Arjona",
            schoolcenter: "",
            activity: "Skate",
            lengthactivity: 5,
            totaldistance: 20,
            inscriptionprice: 0,
            latitude: 37.390055,
            longitude: -6.004180
        },
        {
            id: 15,
            year: 2019,
            day: 23,
            month: 6,
            name: "Campeonato De España De Remo: Cadete, Juvenil Y Senior",
            sportcenter: "CEAR Isla de la Cartuja",
            schoolcenter: "",
            activity: "Remo",
            lengthactivity: 12,
            totaldistance: 30,
            inscriptionprice: 0,
            latitude: 37.410954,
            longitude: -5.993353
        },
        {
            id: 16,
            year: 2019,
            day: 28,
            month: 6,
            name: "Fiesta Del Agua (programa Distrito: Sur)",
            sportcenter: "Piscina Tiro de Linea",
            schoolcenter: "",
            activity: "Natación",
            lengthactivity: 10,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.369310,
            longitude: -5.973603
        },
        {
            id: 17,
            year: 2019,
            day: 14,
            month: 7,
            name: "Acuatlón Velá de Triana",
            sportcenter: "",
            schoolcenter: "",
            activity: "Acuática",
            lengthactivity: 5.6,
            totaldistance: 20,
            inscriptionprice: 0,
            latitude: 37.386471,
            longitude: -6.002250
        },
        {
            id: 18,
            year: 2019,
            day: 22,
            month: 7,
            name: "Copa del Mundo de Fútbol 7 para personas con discapacidad intelectual",
            sportcenter: "C.D. Ramón Cisneros",
            schoolcenter: "",
            activity: "Fútbol",
            lengthactivity: 3,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.352618,
            longitude: -5.947605
        },
        {
            id: 19,
            year: 2019,
            day: 7,
            month: 9,
            name: "Torneo Internacional de Petanca Ciudad de Sevilla",
            sportcenter: "Club de Petanca Pino Montano",
            schoolcenter: "",
            activity: "Otros",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.426656,
            longitude: -5.964473
        },
        {
            id: 20,
            year: 2019,
            day: 15,
            month: 9,
            name: "ATP Challenger 'Copa Sevilla' de Tenis",
            sportcenter: "FA de Tenis",
            schoolcenter: "",
            activity: "Tenis",
            lengthactivity: 4,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.396693,
            longitude: -5.931145
        },
        {
            id: 21,
            year: 2019,
            day: 22,
            month: 9,
            name: "Exhibición del Caballo Angloárabe de Sevilla",
            sportcenter: "Parque del Alamillo",
            schoolcenter: "",
            activity: "Equina",
            lengthactivity: 10,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.418637,
            longitude: -5.995275
        },
        {
            id: 22,
            year: 2019,
            day: 27,
            month: 9,
            name: "Carrera Nocturna del Guadalquivir KH7",
            sportcenter: "",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 2,
            totaldistance: 8.5,
            inscriptionprice: 0,
            latitude: 37.375557,
            longitude: -5.991502
        },
        {
            id: 23,
            year: 2019,
            day: 28,
            month: 9,
            name: "Torneo Internacional de Kárate 'Ciudad de Sevilla'",
            sportcenter: "C.D. Amate",
            schoolcenter: "",
            activity: "Arte marcial",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.379310,
            longitude: -5.945320
        },
        {
            id: 24,
            year: 2019,
            day: 28,
            month: 9,
            name: "Ascenso a Vela del Guadalquivir",
            sportcenter: "CEAR Isla de la Cartuja",
            schoolcenter: "",
            activity: "Acuática",
            lengthactivity: 8,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.410954,
            longitude: -5.993353
        },
        {
            id: 25,
            year: 2019,
            day: 5,
            month: 10,
            name: "Otoño Deportivo en Los Remedios (Programa Distrito: Triana - Los Remedios)",
            sportcenter: "Parque de Los Príncipes",
            schoolcenter: "",
            activity: "Escolar",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.373622,
            longitude: -6.005720
        },
        {
            id: 26,
            year: 2019,
            day: 6,
            month: 10,
            name: "Carrera de la Mujer",
            sportcenter: "Parque de María Luisa",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 4,
            totaldistance: 6,
            inscriptionprice: 0,
            latitude: 37.374946,
            longitude: -5.988715
        }
        ,
        {
            id: 27,
            year: 2019,
            day: 6,
            month: 10,
            name: "II Prueba de Orientación Familiar (Programa Distrito: Macarena - Norte)",
            sportcenter: "Parque de Miraflores",
            schoolcenter: "",
            activity: "Otros",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.411110,
            longitude: -5.963570
        },
        {
            id: 28,
            year: 2019,
            day: 13,
            month: 10,
            name: "Campeonato de España de Triatlón por Clubes, de relevos y parejas",
            sportcenter: "",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 6,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.373622,
            longitude: -6.005720
        },
        {
            id: 29,
            year: 2019,
            day: 13,
            month: 10,
            name: "Torneo Internacional Tenis Femenino WTA 'Memorial Nadia'",
            sportcenter: "FA Tenis",
            schoolcenter: "",
            activity: "Tenis",
            lengthactivity: 4,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.396693,
            longitude: -5.931145
        },
        {
            id: 30,
            year: 2019,
            day: 9,
            month: 11,
            name: "Regata Sevilla - Betis de Remo",
            sportcenter: "Puente del Alamillo",
            schoolcenter: "",
            activity: "Acuática",
            lengthactivity: 3,
            totaldistance: 15,
            inscriptionprice: 0,
            latitude: 37.413464,
            longitude: -5.990773
        },
        {
            id: 31,
            year: 2019,
            day: 9,
            month: 11,
            name: "V Carrera de Orientación Familiar (Programa Distrito: Cerro - Amate)",
            sportcenter: "Parque Amate",
            schoolcenter: "",
            activity: "Otros",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.379310,
            longitude: -5.945320
        },
        {
            id: 32,
            year: 2019,
            day: 9,
            month: 11,
            name: "VII Doñana Trail Marathon",
            sportcenter: "Puerta de Jérez",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 12,
            totaldistance: 71,
            inscriptionprice: 48,
            latitude: 37.381998,
            longitude: -5.994125
        },
        {
            id: 33,
            year: 2019,
            day: 17,
            month: 11,
            name: "Campeonato de Andalucía de Pádel de Selecciones por Provincias",
            sportcenter: "I.D. La Cartuja",
            schoolcenter: "",
            activity: "Pádel",
            lengthactivity: 10,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.420782,
            longitude: -6.002996
        },
        {
            id: 34,
            year: 2019,
            day: 17,
            month: 11,
            name: "Juegos Populares (Programa Distrito: Bellavista)",
            sportcenter: "Parque de Los Bermejales",
            schoolcenter: "",
            activity: "Otros",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.345363,
            longitude: -5.984980
        },
        {
            id: 35,
            year: 2019,
            day: 29,
            month: 11,
            name: "Festival de Fútbol 'Otras Capacidades'",
            sportcenter: "C.D. San Pablo",
            schoolcenter: "",
            activity: "Fútbol",
            lengthactivity: 10,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.396714,
            longitude: -5.960599
        },
        {
            id: 36,
            year: 2019,
            day: 1,
            month: 12,
            name: "Máster Absoluto y de Veteranos de Pádel",
            sportcenter: "",
            schoolcenter: "",
            activity: "Pádel",
            lengthactivity: 10,
            totaldistance: 0,
            inscriptionprice: 0
        },
        {
            id: 37,
            year: 2019,
            day: 31,
            month: 12,
            name: "San Silvestre Sevillana",
            sportcenter: "Parque María Luisa",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 3,
            totaldistance: 5,
            inscriptionprice: 0,
            latitude: 37.374946,
            longitude: -5.988715
        },
        {
            id: 38,
            year: 2019,
            day: 12,
            month: 1,
            name: "WATERPOLO - 9ª Jornada de la Liga Nacional de Primera División",
            sportcenter: "C.D. Hytasa",
            schoolcenter: "",
            activity: "Acuática",
            lengthactivity: 2,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.407737,
            longitude: -5.973819
        },
        {
            id: 39,
            year: 2019,
            day: 26,
            month: 1,
            name: "11ª Jornada de la Liga Nacional de Primera División",
            sportcenter: "C.D. Hytasa",
            schoolcenter: "",
            activity: "Acuática",
            lengthactivity: 2,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.407737,
            longitude: -5.973819
        }
        ,
        {
            id: 40,
            year: 2019,
            day: 9,
            month: 2,
            name: "Final Copa princesa de Asturias de Baloncesto",
            sportcenter: "C.D. San Pablo",
            schoolcenter: "",
            activity: "Baloncesto",
            lengthactivity: 2,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 37.396714,
            longitude: -5.960599
        }
        ,
        {
            id: 41,
            year: 2019,
            day: 10,
            month: 2,
            name: "Carrera En Marcha por la Salud",
            sportcenter: "",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 4,
            totaldistance: 5,
            inscriptionprice: 0,
            latitude: 37.406714,
            longitude: -5.986744
        },
        {
            id: 42,
            year: 2019,
            day: 10,
            month: 2,
            name: "XXXV Zurich Maratón de Sevilla",
            sportcenter: "",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 6,
            totaldistance: 43,
            inscriptionprice: 35,
            latitude: 37.375557,
            longitude: -5.991502
        }
        ,
        {
            id: 43,
            year: 2019,
            day: 3,
            month: 3,
            name: "Duatlón de Sevilla",
            sportcenter: "Parque del Alamillo",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 4,
            totaldistance: 20,
            inscriptionprice: 0,
            latitude: 37.418637,
            longitude: -5.995275
        },
        {
            id: 44,
            year: 2019,
            day: 22,
            month: 5,
            name: "I Jornada Naufit",
            sportcenter: "Playa de la Caleta",
            schoolcenter: "",
            activity: "Acuática",
            lengthactivity: 3,
            totaldistance: 0,
            inscriptionprice: 0,
            latitude: 36.530556,
            longitude: -6.305694
        },
        {
            id: 45,
            year: 2019,
            day: 27,
            month: 4,
            name: "VII Trihércules Cádiz",
            sportcenter: "Glorieta Ing. La Cierva",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 4,
            totaldistance: 20,
            inscriptionprice: 0,
            latitude: 36.505845,
            longitude: -6.277312
        }
    ], function () {
        r.sendStatus(201);
    });
}