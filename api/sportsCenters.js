let express = require('express');
let routes = express.Router();

var sportsCenters = [];

routes.get("/sports-centers/loadInitialData",(req,res) => {
    addData();
    res.send("created")
});

routes.get("/sports-centers",(req,res) => {
    res.send(sportsCenters)
});

routes.post("/sports-centers",(req,res) => {
    let sportsCompetitions = req.body;

    sportsCompetitions.push(sportsCompetitions);

    res.sendStatus(201);
});

routes.delete("/sports-centers",(req,res) => {
    sportsCenters = [];
    res.send(sportsCenters)
});

routes.get("/sports-centers/:id",(req,res) => {

    let id = req.params.id;

    let filteredCenters = sportsCenters.filter((c) => {
        return c.id == parseInt(id);
    });

    if (filteredCenters.length >= 1){
        res.send(filteredCenters[0]);
    } else {
        res.sendStatus(404);
    }
});

routes.put("/sports-centers/:id",(req,res) => {

    let id = req.params.id;
    let updatedCenters = req.body;
    var found = false;

    let updatedSportsCenters = sportsCenters.map((c) => {
        if(c.id == id){
            found = true;
            return updatedCenters;
        } else {
            return c
        }
    });

    if (!found){
        res.sendStatus(404);
    } else {
        sportsCenters = updatedSportsCenters;
        res.sendStatus(200);
    }
});

routes.delete("/sports-centers/:id",(req,res) => {

    let id = req.params.id;
    var found = false;

    let updatedSportsCenters = sportsCenters.filter((c) => {
        if(c.id == id)
            found = true;

        return c.id != id;
    });

    if (!found){
        res.sendStatus(404);
    } else {
        sportsCenters = updatedSportsCenters;
        res.sendStatus(200);
    }
});


routes.post("/sports-centers/:id",(req,res) => {
    res.sendStatus(405);
});

routes.put("/sports-centers",(req,res) => {
    res.sendStatus(405);
});

function addData(){
    sportsCenters = [
    { 
        
        id:1,
        street: "Rafael Alberti",
        name: "AA.VV El pueblo",
        postalcode:41008,
        startingyear: 1990,
        surface: 7000,
        activity:"fútbol",
        paviment:"tierra",
        sportfields: 7 },
    {
        id:2,
        street: "Avda La Revoltosa",
        name: "C.D. Amate",
        postalcode:41006,
        startingyear: 1988,
        surface: 8725,
        activity: "General",
        paviment: "Tierra y Hormigón",
        sportfields: 3 }
    ]
}



module.exports = routes;