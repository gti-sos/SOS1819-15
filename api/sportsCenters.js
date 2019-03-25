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

module.exports = routes;