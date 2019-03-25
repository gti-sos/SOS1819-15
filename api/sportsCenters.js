let express = require('express');
let routes = express.Router();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://juanlu:3636jlgD@sos1819jlgd-su7hb.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

var contacts;

client.connect(err => {
  contacts = client.db("sos1819jlgd").collection("contacts");
  console.log("Connected!");
});




routes.get("/sports-centers/", (req,res)=>{
    
    contacts.find({}).toArray((err,contactsArray)=>{
        
        if(err)
            console.log("Error: "+err);
        
        res.send(contactsArray);        
    });

});


// POST /contacts/

routes.post("/sports-centers/", (req,res)=>{
    
    var newContact = req.body;
    
    contacts.insert(newContact);
    
    res.sendStatus(201);
});

// Load Initial Data

routes.get("/sports-centers/loadInitialData",(req,res) => {
    
    contacts.insertMany( 
        [{ 
        
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
    
    res.send("created");
});
    
routes.delete("/sports-centers",(req,res) => {
    contacts.deleteMany();
    res.send(sportsCenters)
});


module.exports = routes;