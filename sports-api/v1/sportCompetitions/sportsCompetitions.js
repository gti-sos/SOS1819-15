const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbPablo:sossos@cluster0-s3eqj.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, {useNewUrlParser: true});

var sportsCompetitions = [];

client.connect(err => {
    sportsCompetitions = client.db("sos1819-pfs").collection("competitions");
    console.log("Connected!");
});

module.exports = function(app, BASE_PATH){
    console.log("Registering sportsAPI (v1): sports-competitions.");
    var path = "";
    
    console.log("Registering redirection to docs");
    path = BASE_PATH + "/sports-competitions/docs";
    app.get(path, (req, res) => {
        res.redirect('https://documenter.getpostman.com/view/6897422/S17tRoGk');
    });
    
    console.log("Registering get /sports-competitions/loadInitialData");
    path = BASE_PATH + "/sports-competitions/loadInitialData";
    app.get(path, (req,res) =>{
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
    app.get(path, (req,res) =>{
        let month = req.query.month;
        let limit = parseInt(req.query.limit, 10);
        let offset = parseInt(req.query.offset, 10);
        var myquery = {};
        if (typeof month !== 'undefined') {
            myquery = {month: parseInt(month,10)};
        }
        if (typeof limit === 'undefined') {
            limit = 10000;
        }
        if (typeof offset === 'undefined') {
            offset = 0;
        }

        sportsCompetitions.find(myquery, {projection:{_id: 0 }}).skip(offset).limit(limit).toArray((err, competitionArray) => {
            if (err) console.log("Error: " + err);
            if (competitionArray.length == 1) {
                res.send(competitionArray[0]);
            } else {
                res.send(competitionArray);
            }
        });
    });
    console.log("Resource /sports-competitions/ registered");
    
    path = BASE_PATH + "/sports-competitions";
    app.post(path, (req, res) => {
        let newCompetitions = req.body;
        console.log(newCompetitions);
        
        if (validation(newCompetitions)){
            sportsCompetitions.find({"id": parseInt(newCompetitions.id)}, {projection:{_id: 0 }}).toArray((err, competitionArray) => {
    
            if (competitionArray.length < 1) {
                sportsCompetitions.insert(newCompetitions);
                res.sendStatus(201);
            } else {
                res.sendStatus(409);
            }
            });
        }else{
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
    
        sportsCompetitions.find({"id": parseInt(id)}, {projection:{_id: 0 }}).toArray((err, competitionArray) => {
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
        
        sportsCompetitions.find({"year": parseInt(year),"month": parseInt(month)}, {projection:{_id: 0 }}).toArray((err, competitionArray) => {
    
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
        
        var myquery = {id: parseInt(id, 10)};
        
        if (!validation(updatedCompetition)) {
            res.sendStatus(400);
            return ;
        }
    
        sportsCompetitions.find({"id": parseInt(id)}, {projection:{_id: 0 }}).toArray((err, competitionArray) => {
            if (competitionArray.length == 1) {
                if (competitionArray[0].id==parseInt(updatedCompetition.id)){
                    sportsCompetitions.replaceOne(myquery, updatedCompetition, function (err, obj) {
                        if (err) {
                            console.log("error: " + err);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(200);
                        }
                    });
                } else{
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
    app.post(path, (req, res) => {
        res.sendStatus(405);
    });
    
    console.log("Registering put to /sports-competitions");
    path = BASE_PATH + "/sports-competitions";
    app.put(path, (req, res) => {
        res.sendStatus(405);
    });
    
    console.log("sports-competitions (v1) registered");
}

function validation(newCompetitions){
    let r = false;
    if (newCompetitions.hasOwnProperty("id") &&
    newCompetitions.hasOwnProperty("day") &&
    newCompetitions.hasOwnProperty("month") &&
    newCompetitions.hasOwnProperty("name") &&
    newCompetitions.hasOwnProperty("sportcenter") &&
    newCompetitions.hasOwnProperty("schoolcenter") &&
    newCompetitions.hasOwnProperty("activity") &&
    newCompetitions.hasOwnProperty("lengthactivity") &&
    newCompetitions.hasOwnProperty("totaldistance") &&
    newCompetitions.hasOwnProperty("inscriptionprice") &&
    newCompetitions.hasOwnProperty("additionalinfo")){
        r = true;  
    }
    return r;
}

function addData() {
    sportsCompetitions.insertMany([{ 
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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