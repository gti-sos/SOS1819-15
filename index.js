var express = require("express");
var app = express();
let routesEducationsCenters = require('./api/educationsCenters');
let routesSportsCompetitions = require('./api/sportsCompetitions');
let routesSportsCenters = require('./api/sportsCenters');
let bodyParse = require("body-parser");

var port = process.env.PORT || 8080;

app.use(bodyParse.json());
app.use("/",express.static(__dirname+"/public"));

app.use('/api/v1', routesEducationsCenters);
app.use('/api/v1', routesSportsCompetitions);
app.use('/api/v1', routesSportsCenters);

app.get("/time",(request,response) => {
    response.send(new Date());
    var a = {
    "id": "int",
    "year": "numeric",
    "day": "numeric",
    "month": "numeric",
    "name": "string",
    "sportcenter": "string",
    "schoolcenter": "string",
    "activity": "string",
    "lengthactivity": "numeric",
    "totaldistance": "numeric",
    "inscriptionprice": "numeric",
    "additionalinfo": "string"
    };
    
    var b= {
    "id": 6,
    "year": 2018,
    "day": 31,
    "month": 3,
    "name": "sevilla sobre ruedas",
    "sportcenter": "parque amate, parque de los príncipes, parque infanta elena y parque miraflores",
    "schoolcenter": "",
    "activity": "ciclismo",
    "lengthactivity": 2,
    "totaldistance": 7,
    "inscriptionprice": 0,
    "additionalinfo": "Puede participar cualquiera con vehículo a ruedas sin motor (bicicleta, patín, skate, patinete, etc.)"
    };
    console.log(validateForm(b, a));
});

app.listen(port, () => {
    console.log("Server running on port "+ port)
});

function validateForm(data, template) {
    var result = {"isValid": true};
    function validate(data, template) {
        for (var key in template) {
            if (template.hasOwnProperty(key)) {
                if (typeof data[key] === 'object' && typeof template[key] == 'object') {
                    validate(data[key], template[key]);
                } else {
                    if (typeof data[key] !== template[key]) {
                        result.isValid = false;
                        result.msg = key + " doesn't exist or is not of the correct type.";
                        return;
                    }
                }
            }
        }
    }
 
    validate(data, template);
    return result;
}