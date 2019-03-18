var express = require("express");
var app = express();
let routesEducationsCenters = require('./api/educationsCenters');
let bodyParse = require("body-parser");

var port = process.env.PORT || 8080;

app.use(bodyParse.json());
app.use("/",express.static(__dirname+"/public"));

app.use('/api/v1', routesEducationsCenters);

app.get("/time",(request,response) => {
    response.send(new Date());
});


app.listen(port, () => {
    console.log("Magic is happening in port"+ port)

});