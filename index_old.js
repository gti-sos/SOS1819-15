var express = require("express");
var app = express();
let routesEducationsCenters = require('./api/educationsCenters');
let routesEducationsCentersSecure = require('./api/educationsCentersSecure');
let routesSportsCompetitions = require('./api/sportsCompetitions');
let routesSportsCompetitionsSecure = require('./api/sportsCompetitionsSecure');
let routesSportsCenters = require('./api/sportsCenters');
let routesSportsCentersSecure = require('./api/sportsCentersSecure');
let bodyParse = require("body-parser");

var port = process.env.PORT || 8080;

app.use(bodyParse.json());
app.use("/",express.static(__dirname+"/public"));

app.use('/api/v1', routesEducationsCenters);
app.use('/api/v1/secure', routesEducationsCentersSecure);
app.use('/api/v1', routesSportsCompetitions);
app.use('/api/v1/secure', routesSportsCompetitionsSecure);
app.use('/api/v1', routesSportsCenters);
app.use('/api/v1/secure', routesSportsCentersSecure);

app.get("/time",(request,response) => {
    response.send(new Date());
});

app.listen(port, () => {
    console.log("Server running on port "+ port)
});