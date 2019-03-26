let express = require('express');
let routes = express.Router();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbPablo:sossos@cluster0-s3eqj.mongodb.net/test?retryWrites=true";

const client = new MongoClient(uri, {useNewUrlParser: true});

var sportsCompetitions = [];

client.connect(err => {
    sportsCompetitions = client.db("sos1819-pfs").collection("competitions");
    console.log("Connected!");
});

routes.get("/sports-competitions/loadInitialData", (req, res) => {
    if (sportsCompetitions.length > 0) {
        addData();
        res.send("created")
    } else {
        res.sendStatus(409);
    }
    
});

routes.get("/sports-competitions/docs", (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/6901186/S17tRntf');
});

routes.get("/sports-competitions", (req, res) => {
    sportsCompetitions.find({}).toArray((err, competitionArray) => {
        if (err) console.log("Error: " + err);
        res.send(competitionArray);
    });
});

routes.post("/sports-competitions", (req, res) => {
    let newCompetitions = req.body;

    sportsCompetitions.insert(newCompetitions);

    res.sendStatus(201);
});

routes.delete("/sports-competitions", (req, res) => {
    sportsCompetitions.deleteMany();

    res.sendStatus(200);
});

routes.get("/sports-competitions/:id", (req, res) => {

    let id = req.params.id;

    sportsCompetitions.find({"_id": parseInt(id)}).toArray((err, competitionArray) => {

        if (competitionArray.length == 1) {
            res.send(competitionArray[0]);
        } else {
            res.sendStatus(404);
        }
    });
});

routes.put("/sports-competitions/:id", (req, res) => {

    let id = req.params.id;
    let updatedCompetition = req.body;
    var myquery = {_id: parseInt(id, 10)};

    sportsCompetitions.find({"_id": parseInt(id)}).toArray((err, contactsArray) => {

        if (contactsArray.length == 1) {
            sportsCompetitions.replaceOne(myquery, updatedCompetition, function (err, obj) {
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

routes.delete("/sports-competitions/:id", (req, res) => {

    let id = req.params.id;

    var myquery = {_id: parseInt(id, 10)};

    sportsCompetitions.deleteOne(myquery, function (err, obj) {
        if (err) {
            res.sendStatus(404);
        } else {
            res.sendStatus(200);
        }
    });

});


routes.post("/sports-competitions/:id", (req, res) => {
    res.sendStatus(405);
});

routes.put("/sports-competitions", (req, res) => {
    res.sendStatus(405);
});

function addData() {
    sportsCompetitions.insertMany([{ 
        _id: 1,
        year: 2019,
        day: 4,
        month : 4,
        name: "v encuentro escolar y deportivo (programa distrito: macarena - norte)",
        sportcenter: "",
        schoolcenter: "centro virgen milagrosa",
        activity: "escolar",
        lengthactivity: 6,
        totaldistance: 0,
        inscriptionprice: 0,
        additionalinfo: "actividad de promoción deportiva en la que participan los ceip de los distritos Macarena y Norte."},
    {
        _id: 2,
        year: 2019,
        day: 23,
        month : 3,
        name: "campeonato de andalucía de taekwondo, categoría promesas",
        sportcenter: "C.D. Hytasa",
        schoolcenter: "",
        activity: "artes marciales",
        lengthactivity: 6,
        totaldistance: 0,
        inscriptionprice: 0,
        additionalinfo: "Hora: 20:30"},
    {
        _id: 3,
        year: 2019,
        day: 4,
        month : 4,
        name: "Mini olimpiada escolar distrito Cerro-Amate",
        sportcenter: "C.D. Hytasa",
        schoolcenter: "",
        activity: "Escolar",
        lengthactivity: 6,
        totaldistance: 0,
        inscriptionprice: 0,
        additionalinfo: "Impulsar y fomentar el interés por conocer diversas modalidades deportivas entre los alumnos de Educación Primaria de los colegios pertenecientes al Distrito Cerro-Amate."},
    {
        _id: 4,
        year: 2019,
        day: 4,
        month : 4,
        name: "Encuentro Escolar y Deportivo (Programa Distrito: Macarena - Norte)",
        sportcenter: "",
        schoolcenter: "CEIP Manuel Siurot",
        activity: "Escolar",
        lengthactivity: 6,
        totaldistance: 0,
        inscriptionprice: 0,
        additionalinfo: "Actividad de promoción deportiva en la que participan los CEIP de los distritos Macarena y Norte."},
    {
        _id: 5,
        year: 2019,
        day: 19,
        month : 5,
        name: "Carrera popular y escolar Paque de Miraflores",
        sportcenter: "Parque de Miraflores",
        schoolcenter: "",
        activity: "Atletismo",
        lengthactivity: 3,
        totaldistance: 10,
        inscriptionprice: 0,
        additionalinfo: "Salida 10Kms: 9:30 horas"}
    ]);
}

module.exports = routes;