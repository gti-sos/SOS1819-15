const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://juanlu:3636jlgD@sos1819jlgd-wayhl.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, {useNewUrlParser: true});


var sportsCenters = [];

client.connect(err => {
    sportsCenters = client.db("sos1819-jlg").collection("sportscenters");
    console.log("Connected!");
});


// Docs de POSTMAN

module.exports = function(app, BASE_PATH){
    console.log("Registering sportsAPI (v1): sportsCenters.");
    var path = "";
    
    console.log("Registering redirection to docs");
    path = BASE_PATH + "/sports-centers//docs";
    app.get(path, (req, res) => {
        res.redirect('https://documenter.getpostman.com/view/6924371/S17tS8XN');
    });
    
 
 // Carga datos iniciales 
 
    console.log("Registering get /sports-centers/loadInitialData");
    path = BASE_PATH + "/sports-centers/loadInitialData";
    app.get(path, (req,res) =>{
        sportsCenters.find().toArray((err, sportscentersArray) => {
            if (sportscentersArray.length > 0) {
                res.sendStatus(409);
            } else {
                addData();
                res.sendStatus(201);
            }
        });
    });
    console.log("Resource /sports-centers/loadInitialData registered");
    
    // GET a un RECURSO + Busqueda Implementada
    
    console.log("Registering get /sports-centers/");
    path = BASE_PATH + "/sports-centers/";
    app.get(path, (req,res) =>{
        let limit = parseInt(req.query.limit, 10);
        let offset = parseInt(req.query.offset, 10);
        let myquery = {};

        let street = req.query.street;
        let name = req.query.name;
        let postalcode = req.query.postalcode;
        let startingyear = req.query.startingyear;
        let surface = req.query.surface;
        let activity = req.query.activity;
        let paviment = req.query.paviment;
        let sportfields = req.query.sportfields;
   

        if (typeof street !== 'undefined') {
            myquery.street = street;
        }
        if (typeof name !== 'undefined') {
            myquery.name = name;
        }
        if (typeof postalcode !== 'undefined') {
            myquery.postalcode = parseInt(postalcode,10);
        }
        if (typeof startingyear !== 'undefined') {
            myquery.startingyear = parseInt(startingyear,10);
        }
        if (typeof surface !== 'undefined') {
            myquery.surface = parseInt(surface,10);
        }
        if (typeof activity !== 'undefined') {
            myquery.activity = activity;
        }
        if (typeof paviment !== 'undefined') {
            myquery.paviment = paviment;
        }
        if (typeof sportfields !== 'undefined') {
            myquery.sportfields = parseInt(sportfields,10);
        }
       
        if (typeof limit === 'undefined') {
            limit = 10000;
        }
        if (typeof offset === 'undefined') {
            offset = 0;
        }

        sportsCenters.find(myquery, {projection:{_id: 0 }}).skip(offset).limit(limit).toArray((err, sportscentersArray) => {
            if (err) console.log("Error: " + err);
            if (sportscentersArray.length == 1) {
                res.send(sportscentersArray[0]);
            } else {
                res.send(sportscentersArray);
            }
        });
    });
    console.log("Resource /sports-centers/ registered");
    
    
    // POST a un RECURSO
   
    path = BASE_PATH + "/sports-centers/";
    app.post(path, (req, res) => {
        let newsportsCenters = req.body;

        if (validation(newsportsCenters)){
            sportsCenters.find({"id": parseInt(newsportsCenters.id)}, {projection:{_id: 0 }}).toArray((err, sportscentersArray) => {
    
            if (sportscentersArray.length < 1) {
                res.sendStatus(201);
            } else {
                res.sendStatus(409);
            }
            });
        }else{
            res.sendStatus(400);
        }
    });
    
    // DELETE a un RECURSO (Borra TODO)
    
    console.log("Registering delete to /sports-centers/");
    path = BASE_PATH + "/sports-centers/";
    app.delete(path, (req, res) => {
        sportsCenters.deleteMany();
        res.sendStatus(200);
    });

    // PUT a un RECURSO CONCRETO

    console.log("Registering get to /sports-centers/:id");
    path = BASE_PATH + "/sports-centers/:id";
    app.get(path, (req, res) => {
        let id = req.params.id;
    
        sportsCenters.find({"id": parseInt(id)}, {projection:{_id: 0 }}).toArray((err, sportscentersArray) => {
            if (sportscentersArray.length == 1) {
                res.send(sportscentersArray[0]);
            } else {
                res.sendStatus(404);
            }
        });
    });

    // GET a un RECURSO CONCRETO

    console.log("Registering get to /sports-centers/:postalcode/:sportfields");
    path = BASE_PATH + "/sports-centers/:postalcode/:activity";
    app.get(path, (req, res) => {
        var postalcode = req.params.postalcode;
        var sportfields = req.params.sportfields;
        
        sportsCenters.find({"postalcode": parseInt(postalcode),"sportfields": parseInt(sportfields)}, {projection:{_id: 0 }}).toArray((err, sportscentersArray) => {
    
            if (sportscentersArray.length > 0) {
                if (sportscentersArray.length == 1) {
                    res.send(sportscentersArray[0]);
                } else {
                    res.send(sportscentersArray);
                }
            } else {
                res.sendStatus(404);
            }
        });
    });

    // PUT a un RECURSO CONCRETO + VALIDACION FORMA
    

    console.log("Registering put to /sports-centers/:id");
    path = BASE_PATH + "/sports-centers/:id";
    app.put(path, (req, res) => {
        let id = req.params.id;
        let updatedCenters = req.body;
        
        var myquery = {id: parseInt(id, 10)};
        
        if (!validation(updatedCenters)) {
            res.sendStatus(400);
            return ;
        }
    
        sportsCenters.find({"id": parseInt(id)}, {projection:{_id: 0 }}).toArray((err, sportscentersArray) => {
            if (sportscentersArray.length == 1) {
                if (sportscentersArray[0].id==parseInt(updatedCenters.id)){
                    sportsCenters.replaceOne(myquery, updatedCenters, function (err, obj) {
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
    
    // DELETE a un RECURSO CONCRETO

    console.log("Registering delete to /sports-centers/:id");
    path = BASE_PATH + "/sports-centers/:id";
    app.delete(path, (req, res) => {
        let id = req.params.id;
        var myquery = {id: parseInt(id, 10)};
    
        sportsCenters.deleteOne(myquery, function (err, obj) {
            if (err) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        });
    });
    
    
    // POST a un RECURSO CONCRETO - ERROR 405 - 
    
    console.log("Registering post to /sports-centers/:id");
    path = BASE_PATH + "/sports-centers/:id";
    app.post(path, (req, res) => {
        res.sendStatus(405);
    });
    
    console.log("Registering put to /sports-centers/");
    path = BASE_PATH + "/sports-centers/";
    app.put(path, (req, res) => {
        res.sendStatus(405);
    });
    
    console.log("sports-centers/ (v1) registered");
    }


    // FUNCION VALIDACION JSON

function validation(newsportsCenters){
    let r = false;
    if (newsportsCenters.hasOwnProperty("id") &&
    newsportsCenters.hasOwnProperty("street") &&
    newsportsCenters.hasOwnProperty("name") &&
    newsportsCenters.hasOwnProperty("postalcode") &&
    newsportsCenters.hasOwnProperty("startingyear") &&
    newsportsCenters.hasOwnProperty("surface") &&
    newsportsCenters.hasOwnProperty("activity") &&
    newsportsCenters.hasOwnProperty("paviment") &&
    newsportsCenters.hasOwnProperty("sportfields")){
        r = true;  
    }
    return r;
} 


// Load Initial Data


    function addData() {
    sportsCenters.insertMany([{ 
        
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
        sportfields: 3 },
        
    {
        id:3,
        street: "Tesalónica",
        name: "C.D. San Pablo",
        postalcode:41007,
        startingyear: 1990,
        surface: 700,
        activity: "Fútbol",
        paviment: "Tierra y Hormigón",
        sportfields: 5 },
        
    {
        id:4,
        street: "Avda Virgen De La Esperanza",
        name: "C.D. Los Bermejales",
        postalcode:41012,
        startingyear: 1997,
        surface: 528,
        activity: "Balonmano",
        paviment: "Hormigón",
        sportfields: 1 },
        
    {
        id:5,
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