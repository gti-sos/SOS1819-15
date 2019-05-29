const MongoClient = require('mongodb').MongoClient;

const PABLO_MONGO_URI = process.env.PABLO_MONGO_URI;
const PABLO_MONGO_USER = process.env.PABLO_MONGO_USER;
const PABLO_MONGO_PASS = process.env.PABLO_MONGO_PASS;
const PABLO_DB_COLLECTION_API = process.env.PABLO_DB_COLLECTION_API;

const PABLO_DB_NAME = process.env.PABLO_DB_NAME;
const URI = "mongodb+srv://" + PABLO_MONGO_USER + ":" + PABLO_MONGO_PASS + "@" + PABLO_MONGO_URI;

const client = new MongoClient(URI, {useNewUrlParser: true});

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
    app.get(path, (req, res) => {
        res.redirect('https://documenter.getpostman.com/view/6897422/S17tRoGk');
    });

    console.log("Registering get /sports-competitions/loadInitialData");
    path = BASE_PATH + "/sports-competitions/loadInitialData";
    app.get(path, (req, res) => {
        sportsCompetitions.find().toArray((err, competitionArray) => {
            if (competitionArray.length > 0) {
                res.sendStatus(409);
            } else {
                addData(res);
            }
        });
    });
    console.log("Resource /sports-competitions/loadInitialData registered");

    console.log("Registering get /sports-competitions/");
    path = BASE_PATH + "/sports-competitions";
    app.get(path, (req, res) => {
        let limit = parseInt(req.query.limit, 10);
        let offset = parseInt(req.query.offset, 10);
        let fromMonth = req.query.fromMonth;
        let toMonth = req.query.toMonth;

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

        if (typeof year !== 'undefined') {
            myquery.year = parseInt(year, 10);
        }
        if (typeof month !== 'undefined') {
            myquery.month = parseInt(month, 10);
        }
        if (typeof day !== 'undefined') {
            myquery.day = parseInt(day, 10);
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
        if (typeof limit === 'undefined') {
            limit = 10000;
        }
        if (typeof offset === 'undefined') {
            offset = 0;
        }
        sportsCompetitions.find(myquery, { projection: { _id: 0 } }).skip(offset).limit(limit).toArray((err, competitionArray) => {
            if (err) console.log("Error: " + err);
            var filteredCompetitions = competitionArray;
            if (!isNaN(fromMonth) && typeof fromMonth !== 'undefined' && typeof fromMonth !== 'null') {
                fromMonth = parseInt(fromMonth, 10);
                filteredCompetitions = competitionArray
                    .filter((comp) => {
                        return (comp.month >= fromMonth);
                    });
            }
            if (toMonth>=fromMonth && !isNaN(toMonth) && typeof toMonth !== 'undefined' && typeof toMonth !== 'null') {
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
    app.post(path, (req, res) => {
        let newCompetitions = req.body;

        if (validation(newCompetitions)) {
            sportsCompetitions.find({ "id": parseInt(newCompetitions.id) }, { projection: { _id: 0 } }).toArray((err, competitionArray) => {

                if (competitionArray.length < 1) {
                    sportsCompetitions.insert(newCompetitions);
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
    app.delete(path, (req, res) => {
        sportsCompetitions.deleteMany();
        res.sendStatus(200);
    });

    console.log("Registering get to /sports-competitions/:id");
    path = BASE_PATH + "/sports-competitions/:id";
    app.get(path, (req, res) => {
        let id = req.params.id;

        sportsCompetitions.find({ "id": parseInt(id) }, { projection: { _id: 0 } }).toArray((err, competitionArray) => {
            if (competitionArray.length == 1) {
                res.send(competitionArray[0]);
            } else {
                res.sendStatus(404);
            }
        });
    });

    console.log("Registering get to /sports-competitions/:year/:month");
    path = BASE_PATH + "/sports-competitions/:year/:month";
    app.get(path, (req, res) => {
        var year = req.params.year;
        var month = req.params.month;

        sportsCompetitions.find({ "year": parseInt(year), "month": parseInt(month) }, { projection: { _id: 0 } }).toArray((err, competitionArray) => {

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
    app.put(path, (req, res) => {
        let id = req.params.id;
        let updatedCompetition = req.body;

        var myquery = { id: parseInt(id, 10) };

        if (!validation(updatedCompetition)) {
            res.sendStatus(400);
            return;
        }

        sportsCompetitions.find({ "id": parseInt(id) }, { projection: { _id: 0 } }).toArray((err, competitionArray) => {
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
    app.delete(path, (req, res) => {
        let id = req.params.id;
        var myquery = { id: parseInt(id, 10) };

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
    app.post(path, (req, res) => {
        res.sendStatus(405);
    });

    console.log("Registering put to /sports-competitions");
    path = BASE_PATH + "/sports-competitions";
    app.put(path, (req, res) => {
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
        newCompetitions.hasOwnProperty("inscriptionprice")) {
        if (typeof newCompetitions.year !== 'undefined' &&
            typeof newCompetitions.year !== 'month' &&
            typeof newCompetitions.year !== 'day') {
            r = true;
        }
    }
    return r;
}

function addData(r) {
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
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
        },
        {
            id: 7,
            year: 2019,
            day: 25,
            month: 5,
            name: "Campeonato de Andalucía de Natación de Aguas Abiertas",
            sportcenter: "C. Esp. de Alto Rendimiento de la Isla de la Cartuja",
            schoolcenter: "",
            activity: "Natación",
            lengthactivity: 10,
            totaldistance: 12.5,
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
        },
        {
            id: 14,
            year: 2019,
            day: 15,
            month: 6,
            name: "Día Del Patín (programa Distrito: Casco Antiguo)",
            sportcenter: "",
            schoolcenter: "",
            activity: "Skate",
            lengthactivity: 5,
            totaldistance: 20,
            inscriptionprice: 0
        },
        {
            id: 15,
            year: 2019,
            day: 23,
            month: 6,
            name: "Campeonato De España De Remo: Cadete, Juvenil Y Senior",
            sportcenter: "",
            schoolcenter: "",
            activity: "Remo",
            lengthactivity: 12,
            totaldistance: 30,
            inscriptionprice: 0
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
            totaldistance:  0,
            inscriptionprice: 0
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
            lengthactivity: 5,
            totaldistance: 20,
            inscriptionprice: 0
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
            inscriptionprice: 0
        },
        {
            id: 19,
            year: 2019,
            day: 7,
            month:9 ,
            name: "Torneo Internacional de Petanca Ciudad de Sevilla",
            sportcenter: "Club de Petanca Pino Montano",
            schoolcenter: "",
            activity: "Otros",
            lengthactivity: 5,
            totaldistance: 0,
            inscriptionprice: 0
        },
        {
            id: 20,
            year: 2019,
            day: 15,
            month: 9,
            name: "ATP Challenger 'Copa Sevilla' de Tenis",
            sportcenter: "",
            schoolcenter: "",
            activity: "Tenis",
            lengthactivity: 4,
            totaldistance: 0,
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice:0
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
            inscriptionprice: 0
        },
        {
            id: 24,
            year: 2019,
            day: 28,
            month: 9,
            name: "Ascenso a Vela del Guadalquivir",
            sportcenter: "",
            schoolcenter: "",
            activity: "Acuática",
            lengthactivity: 8,
            totaldistance: 0,
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
        },
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
            inscriptionprice: 0
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
            inscriptionprice: 0
        },
        {
            id: 29,
            year: 2019,
            day: 13,
            month: 10,
            name: "Torneo Internacional Tenis Femenino WTA 'Memorial Nadia'",
            sportcenter: "",
            schoolcenter: "",
            activity: "Tenis",
            lengthactivity: 4,
            totaldistance: 0,
            inscriptionprice: 0
        },
        {
            id: 30,
            year: 2019,
            day: 9,
            month: 11,
            name: "Regata Sevilla - Betis de Remo",
            sportcenter: "Guadalquivir",
            schoolcenter: "",
            activity: "Acuática",
            lengthactivity: 3,
            totaldistance: 15,
            inscriptionprice: 0
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
            inscriptionprice: 0
        },
        {
            id: 32,
            year: 2019,
            day: 9,
            month: 11,
            name: "VII Doñana Trail Marathon",
            sportcenter: "",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 12,
            totaldistance: 71,
            inscriptionprice: 48
        },
        {
            id: 33,
            year: 2019,
            day: 17,
            month: 11,
            name: "Campeonato de Andalucía de Pádel de Selecciones por Provincias",
            sportcenter: "",
            schoolcenter: "",
            activity: "Pádel",
            lengthactivity: 10,
            totaldistance: 0,
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice: 0
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
            inscriptionprice:0
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
            inscriptionprice:0
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
            inscriptionprice:0
        },
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
            inscriptionprice:0
        },
        {
            id: 41,
            year: 2019,
            day: 10,
            month: 2,
            name: "Carrera 'En Marcha por la Salud",
            sportcenter: "",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 4,
            totaldistance: 5,
            inscriptionprice:0
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
            inscriptionprice:35
        },
        {
            id: 43,
            year: 2019,
            day: 3,
            month: 3,
            name: "Duatlón de Sevilla",
            sportcenter: "",
            schoolcenter: "",
            activity: "Atletismo",
            lengthactivity: 4,
            totaldistance: 20,
            inscriptionprice:0
        }
    ], function () {
        r.sendStatus(201);
    });
}