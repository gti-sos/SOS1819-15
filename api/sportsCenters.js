let express = require('express');
let routes = express.Router();


// Conexión MongoDB 
const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://juanlu:3636jlgD@sos1819jlgd-su7hb.mongodb.net/test?retryWrites=true";

const client = new MongoClient(uri, { useNewUrlParser: true });

var sportsCenters = [];

client.connect(err => {
    sportsCenters = client.db("sos1819-pfs").collection("competitions");
    console.log("Connected!");
});

//POSTMAN

routes.get("/sports-centers/docs", (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/6897422/S17tRoGk');
});

// GET y PAGINACIÓN 

routes.get("/sports-centers", (req, res) => {
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

    console.log("Limit: " + limit);
    sportsCenters.find(myquery).skip(offset).limit(limit).toArray((err, sportscentersArray) => {
        if (err)
            console.log("Error: " + err);
        res.send(sportscentersArray);
    });
});

// LOAD INITIAL DATA

routes.get("/sports-centers/loadInitialData", (req, res) => {
    sportsCenters.find().toArray((err, sportscentersArray) => {
        if (sportscentersArray.length > 0) {
            res.sendStatus(409);
        } else {
            addData();
            res.send("created")
        }
    });
});


// POST A UN CONJUNTO
routes.post("/sports-centers", (req, res) => {
    let newsportsCenters = req.body;
    
    if (validation(newsportsCenters)){
        sportsCenters.find({"_id": parseInt(newsportsCenters._id)}).toArray((err, sportscentersArray) => {

        if (sportscentersArray.length < 1) {
            sportsCenters.insert(newsportsCenters);
            res.sendStatus(201);
        } else {
            res.sendStatus(409);
        }
        });
    }else{
        res.sendStatus(400);
    }
    
});

// DELETE A UN CONJUNTO 

routes.delete("/sports-centers", (req, res) => {
    sportsCenters.deleteMany();

    res.sendStatus(200);
});

// GET A UN RECURSO CONCRETO

routes.get("/sports-centers/:id", (req, res) => {

    let id = req.params.id;

    sportsCenters.find({"_id": parseInt(id)}).toArray((err, sportscentersArray) => {

        if (sportscentersArray.length == 1) {
            res.send(sportscentersArray[0]);
        } else {
            res.sendStatus(404);
        }
    });
});

// PUT A UN RECURSO CONCRETO 

routes.put("/sports-centers/:id", (req, res) => {

    let id = req.params.id;
    let updatedCenter = req.body;
    var myquery = {_id: parseInt(id, 10)};

    sportsCenters.find({"_id": parseInt(id)}).toArray((err, sportscentersArray) => {

        if (sportscentersArray.length == 1) {
            if (sportscentersArray[0]._id==id){
                sportsCenters.replaceOne(myquery, updatedCenter, function (err, obj) {
                if (err) {
                    console.log("error: " + err);
                    res.sendStatus(404);
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

// DELETE RECURSO CONCRETO

routes.delete("/sports-centers/:id", (req, res) => {

    let id = req.params.id;

    var myquery = {_id: parseInt(id, 10)};

    sportsCenters.deleteOne(myquery, function (err, obj) {
        if (err) {
            res.sendStatus(404);
        } else {
            res.sendStatus(200);
        }
    });

});

 // POST A UN CONJUNTO

routes.post("/sports-centers", (req, res) => {
    let newsportsCenters = req.body;
    
    if (validation(newsportsCenters)){
        sportsCompetitions.find({"_id": parseInt(newsportsCenters._id)}).toArray((err, sportscentersArray) => {

        if (sportscentersArray.length < 1) {
            sportsCenters.insert(newsportsCenters);
            res.sendStatus(201);
        } else {
            res.sendStatus(409);
        }
        });
    }else{
        res.sendStatus(400);
    }
    
});

// POST A UN RECURSO CONCRETO (ERROR)

routes.post("/sports-centers/:id", (req, res) => {
    res.sendStatus(405);
});


// PUT A UN CONJUNTO

routes.put("/sports-centers", (req, res) => {
    res.sendStatus(405);
});

// Load Initial Data


    function addData() {
    sportsCenters.insertMany([{ 
        
        _id:1,
        street: "Rafael Alberti",
        name: "AA.VV El pueblo",
        postalcode:41008,
        startingyear: 1990,
        surface: 7000,
        activity:"fútbol",
        paviment:"tierra",
        sportfields: 7 },
    {
        _id:2,
        street: "Avda La Revoltosa",
        name: "C.D. Amate",
        postalcode:41006,
        startingyear: 1988,
        surface: 8725,
        activity: "General",
        paviment: "Tierra y Hormigón",
        sportfields: 3 },
        
    {
        _id:3,
        street: "Tesalónica",
        name: "C.D. San Pablo",
        postalcode:41007,
        startingyear: 1990,
        surface: 700,
        activity: "Fútbol",
        paviment: "Tierra y Hormigón",
        sportfields: 5 },
        
    {
        _id:4,
        street: "Avda Virgen De La Esperanza",
        name: "C.D. Los Bermejales",
        postalcode:41012,
        startingyear: 1997,
        surface: 528,
        activity: "Balonmano",
        paviment: "Hormigón",
        sportfields: 1 },
        
    {
        _id:5,
        street: "Avda Hytasa",
        name: "C.D. Hytasa",
        postalcode:41006,
        startingyear: 1992,
        surface: 6000,
        activity: "General",
        paviment: "Cesped , Hormigon",
        sportfields: 4 }
        
        
    ]);
        
   } 

module.exports = routes;

// VALIDACIÓN JSON

function validation(newsportscenter){
    let r = false;
    if (newsportscenter.hasOwnProperty("_id") &&
    newsportscenter.hasOwnProperty("street") &&
    newsportscenter.hasOwnProperty("name") &&
    newsportscenter.hasOwnProperty("postalcode") &&
    newsportscenter.hasOwnProperty("startingyear") &&
    newsportscenter.hasOwnProperty("surface") &&
    newsportscenter.hasOwnProperty("activity") &&
    newsportscenter.hasOwnProperty("paviment") &&
    newsportscenter.hasOwnProperty("sportfields")){
        r = true;  
    }
    return r;
} 
