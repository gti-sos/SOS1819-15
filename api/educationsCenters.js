let express = require('express');
let routes = express.Router();

var educationsCenters = [];

routes.get("/educations-centers/loadInitialData",(req,res) => {
    addData();
    res.send("creado")
});

routes.get("/educations-centers",(req,res) => {
    res.send(educationsCenters)
});

routes.post("/educations-centers",(req,res) => {
    let newEducationCenter = req.body;

    educationsCenters.push(newEducationCenter);

    res.sendStatus(201);
});

routes.delete("/educations-centers",(req,res) => {
    educationsCenters = [];
    res.send(educationsCenters)
});

routes.get("/educations-centers/:id",(req,res) => {

    let id = req.params.id;

    let filteredCenters = educationsCenters.filter((c) => {
        return c.id == parseInt(id);
    });

    if (filteredCenters.length >= 1){
        res.send(filteredCenters[0]);
    } else {
        res.sendStatus(404);
    }
});

routes.put("/educations-centers/:id",(req,res) => {

    let id = req.params.id;
    let updatedCenter = req.body;
    var found = false;

    let updatedEducationsCenters = educationsCenters.map((c) => {
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
        educationsCenters = updatedEducationsCenters;
        res.sendStatus(200);
    }
});

routes.delete("/educations-centers/:id",(req,res) => {

    let id = req.params.id;
    var found = false;

    let updatedEducationsCenters = educationsCenters.filter((c) => {
        if(c.id == id)
            found = true;

        return c.id != id;
    });

    if (!found){
        res.sendStatus(404);
    } else {
        educationsCenters = updatedEducationsCenters;
        res.sendStatus(200);
    }
});



routes.post("/educations-centers/:id",(req,res) => {
    res.sendStatus(405);
});

routes.put("/educations-centers",(req,res) => {
    res.sendStatus(405);
});

function addData(){
    educationsCenters = [{
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
    }
    ]
}



module.exports = routes;