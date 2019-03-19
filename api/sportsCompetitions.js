let express = require('express');
let routes = express.Router();

var sportsCompetitions = [];

routes.get("/sports-competitions/loadInitialData",(req,res) => {
    addData();
    res.send("created")
});

routes.get("/sports-competitions",(req,res) => {
    res.send(sportsCompetitions)
});

routes.post("/sports-competitions",(req,res) => {
    let newEducationCenter = req.body;

    sportsCompetitions.push(newEducationCenter);

    res.sendStatus(201);
});

routes.delete("/sports-competitions",(req,res) => {
    sportsCompetitions = [];
    res.send(sportsCompetitions)
});

routes.get("/sports-competitions/:id",(req,res) => {

    let id = req.params.id;

    let filteredCenters = sportsCompetitions.filter((c) => {
        return c.id == parseInt(id);
    });

    if (filteredCenters.length >= 1){
        res.send(filteredCenters[0]);
    } else {
        res.sendStatus(404);
    }
});

routes.put("/sports-competitions/:id",(req,res) => {

    let id = req.params.id;
    let updatedCenter = req.body;
    var found = false;

    let updatedEducationsCenters = sportsCompetitions.map((c) => {
        if(c.id == id){
            found = true;
            return updatedCenter;
        } else {
            return c
        }
    });



    if (!found){
        res.sendStatus(404);
    } else {
        sportsCompetitions = updatedEducationsCenters;
        res.sendStatus(200);
    }
});

routes.delete("/sports-competitions/:id",(req,res) => {

    let id = req.params.id;
    var found = false;

    let updatedEducationsCenters = sportsCompetitions.filter((c) => {
        if(c.id == id)
            found = true;

        return c.id != id;
    });

    if (!found){
        res.sendStatus(404);
    } else {
        sportsCompetitions = updatedEducationsCenters;
        res.sendStatus(200);
    }
});



routes.post("/sports-competitions/:id",(req,res) => {
    res.sendStatus(405);
});

routes.put("/sports-competitions",(req,res) => {
    res.sendStatus(405);
});

function addData(){
    sportsCompetitions = [
    { 
        id: 1,
        year: 2018,
        day: 4,
        month : 4,
        name: "v encuentro escolar y deportivo (programa distrito: macarena - norte)",
        sportcenter: "",
        schoolcenter: "centro virgen milagrosa",
        initiallocation: "", 
        endlocation: "",
        activity: "escolar",
        lengthactivity: 6,
        totaldistance: 0,
        inscriptionprice: 0,
        additionalinfo: "actividad de promoción deportiva en la que participan los ceip de los distritos Macarena y Norte."},
    {
        id: 2,
        year: 2018,
        day: 23,
        month : 3,
        name: "campeonato de andalucía de taekwondo, categoría promesas",
        sportcenter: "c.d. amate",
        schoolcenter: "",
        initiallocation: "",
        endlocation: "",
        activity: "artes marciales",
        lengthactivity: 6,
        totaldistance: 0,
        inscriptionprice: 0,
        additionalinfo: "Hora: 20:30"}
    ]
}



module.exports = routes;