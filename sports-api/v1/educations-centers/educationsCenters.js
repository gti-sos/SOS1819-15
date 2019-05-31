const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sos:sos@sos1819-15dro-hqcpp.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, {useNewUrlParser: true});

var educationsCenters = [];

client.connect(err => {
    educationsCenters = client.db("sos1819-15dro").collection("educationsCenter");
    console.log("Connected!");
});

module.exports = function (app, BASE_PATH) {

    var path;

    path = BASE_PATH + "/educations-centers/loadInitialData";
    app.get(path, (req, res) => {
        educationsCenters.find().toArray((err, contactsArray) => {
            if (contactsArray.length > 0) {
                res.sendStatus(409);
            } else {
                addData(res);
            }
        });
    });

    path = BASE_PATH + "/educations-centers/docs";
    app.get(path, (req, res) => {
        res.redirect('https://documenter.getpostman.com/view/6901186/S1LyUTGF?version=latest');
    });

    path = BASE_PATH + "/educations-centers";
    app.get(path, (req, res) => {
        let ownership = req.query.ownership;
        let country = req.query.country;
        let center = req.query.center;
        let name = req.query.name;
        let domicile = req.query.domicile;
        let locality = req.query.locality;
        let phone = req.query.phone;
        let lat = req.query.lat;
        let lon = req.query.lon;
        let sports_education = req.query.sports_education;
        let monthStart = req.query.monthStart;

        let limit = parseInt(req.query.limit, 10);
        let offset = parseInt(req.query.offset, 10);
        let myquery = {};

        if (typeof ownership !== 'undefined') {
            myquery.ownership = ownership;
        }
        if (typeof country !== 'undefined') {
            myquery.country = country;
        }
        if (typeof center !== 'undefined') {
            myquery.center = center
        }
        if (typeof name !== 'undefined') {
            myquery.name = name
        }
        if (typeof domicile !== 'undefined') {
            myquery.domicile = domicile
        }
        if (typeof phone !== 'undefined') {
            myquery.phone = parseInt(phone);
        }
        if (typeof locality !== 'undefined') {
            myquery.locality = locality
        }
        if (typeof lat !== 'undefined') {
            myquery.lat = parseFloat(lat);
        }
        if (typeof lon !== 'undefined') {
            myquery.lon = parseFloat(lon);
        }
        if (typeof sports_education !== 'undefined') {
            myquery.sports_education = parseInt(sports_education);
        }
        if (typeof monthStart !== 'undefined') {
            myquery.monthStart = parseInt(monthStart);
        }

        if (typeof limit === 'undefined') {
            limit = 10000;
        }
        if (typeof offset === 'undefined') {
            offset = 0;
        }

        console.log("Query: " + JSON.stringify(myquery));
        educationsCenters.find(myquery).sort({id: 1}).project({_id: 0}).skip(offset).limit(limit).toArray((err, contactsArray) => {

            if (err)
                console.log("Error: " + err);

            //contactsArray.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
            res.send(contactsArray);
        });
    });

    path = BASE_PATH + "/educations-centers";
    app.post(path, (req, res) => {

        let newEducationCenter = req.body;
        let id = parseInt(newEducationCenter.id, 10);

        if (!validation(newEducationCenter)) {
            res.sendStatus(400);
            return;
        }

        educationsCenters.find({"id": parseInt(id)}).toArray((err, contactsArray) => {

            if (contactsArray.length == 0) {
                educationsCenters.insertOne(newEducationCenter, function (error, response) {
                    if(error) {
                        res.sendStatus(409);
                    } else {
                        res.sendStatus(201);
                    }
                });

            } else {
                res.sendStatus(409);
            }
        });


    });

    path = BASE_PATH + "/educations-centers";
    app.delete(path, (req, res) => {
        educationsCenters.deleteMany(function (error, response) {
            if(error) {
                res.sendStatus(409);
            } else {
                res.sendStatus(200);
            }
        });
    });

    path = BASE_PATH + "/educations-centers/:id";
    app.get(path, (req, res) => {

        let id = req.params.id;

        educationsCenters.find({"id": parseInt(id)}).project({_id: 0}).toArray((err, contactsArray) => {

            if (contactsArray.length > 0) {
                res.send(contactsArray[0]);
            } else {
                res.sendStatus(404);
            }
        });

    });

    path = BASE_PATH + "/educations-centers/:id";
    app.put(path, (req, res) => {

        let id = req.params.id;
        let updatedCenters = req.body;
        var myquery = {id: parseInt(id, 10)};

        if (parseInt(id, 10) !== parseInt(updatedCenters.id, 10)) {
            res.sendStatus(400);
            return;
        }

        educationsCenters.find({"id": parseInt(id)}).toArray((err, contactsArray) => {

            if (contactsArray.length == 1) {
                educationsCenters.replaceOne(myquery, updatedCenters, function (err, obj) {
                    if (err) {
                        console.log("error: " + err);
                        res.sendStatus(404);
                    } else {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.sendStatus(404);
            }
        });


    });

    path = BASE_PATH + "/educations-centers/:id";
    app.delete(path, (req, res) => {

        let id = req.params.id;

        var myquery = {id: parseInt(id, 10)};

        educationsCenters.find({"id": parseInt(id)}).toArray((err, contactsArray) => {

            if (contactsArray.length > 0) {
                educationsCenters.deleteOne(myquery, function (err, obj) {
                    if (err) {
                        res.sendStatus(404);
                    } else {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.sendStatus(404);
            }
        });


    });


    path = BASE_PATH + "/educations-centers/:id";
    app.post(path, (req, res) => {
        res.sendStatus(405);
    });

    path = BASE_PATH + "/educations-centers";
    app.put(path, (req, res) => {
        res.sendStatus(405);
    });
};

function validation(newCompetitions) {
    let r = false;
    if (newCompetitions.hasOwnProperty("id") &&
        newCompetitions.hasOwnProperty("country") &&
        newCompetitions.hasOwnProperty("center") &&
        newCompetitions.hasOwnProperty("name") &&
        newCompetitions.hasOwnProperty("ownership") &&
        newCompetitions.hasOwnProperty("domicile") &&
        newCompetitions.hasOwnProperty("locality") &&
        newCompetitions.hasOwnProperty("phone") &&
        newCompetitions.hasOwnProperty("lat") &&
        newCompetitions.hasOwnProperty("lon") &&
        newCompetitions.hasOwnProperty("sports_education") &&
        newCompetitions.hasOwnProperty("monthStart")) {
        r = true;
    }
    return r;
}

function addData(res) {

    educationsCenters.deleteMany();

    educationsCenters.insertMany([{
        id: 1
        , center: "Centro Docente Privado"
        , name: "El Tobogán"
        , ownership: "Privado"
        , domicile: "C/ Virgen del Valle  38"
        , locality: "Sevilla"
        , phone: 954276212
        , lat: 37.37596064
        , lon: -5.998167749
        , sports_education: 1
        , country: "Spain"
        , monthStart: 6
    },
        {
            id: 2
            , center: "Centro Docente Privado"
            , name: "Centro de Estudios Sanitarios  Dr. Arduán"
            , ownership: "Privado"
            , domicile: "Avda. de Jerez  46"
            , locality: "Sevilla"
            , phone: 954693300
            , lat: 37.325442656
            , lon: -5.965175402
            , sports_education: 0
            , country: "Spain"
            , monthStart: 4
        },
        {
            id: 3
            , center: "Centro Docente Privado"
            , name: "Arenal Centro de Formación Profesional"
            , ownership: "Concertado"
            , domicile: "C/ Federico Sánchez Bedoya  14"
            , locality: "Sevilla"
            , phone: 954224354
            , lat: 37.386048965747804
            , lon: -5.99528431892395
            , sports_education: 0
            , country: "Spain"
            , monthStart: 1
        },
        {
            id: 4
            , center: "Centro Docente Privado"
            , name: "System  Centros de Formación I"
            , ownership: "Privado"
            , domicile: "C/ O'Donell  10"
            , locality: "Sevilla"
            , phone: 954502550
            , lat: 37.392222855
            , lon: -5.995382915
            , sports_education: 1
            , country: "Spain"
            , monthStart: 2
        },
        {
            id: 5
            , center: "Centro de Educación Infantil"
            , name: "Snoopy 8"
            , ownership: "Privado"
            , domicile: "C/ San Roque  6 y 8"
            , locality: "Sevilla"
            , phone: 954210595
            , lat: 37.3913194325946
            , lon: -5.99841846498611
            , sports_education: 1
            , country: "Spain"
            , monthStart: 6
        },
        {
            id: 6
            , center: "Centro Docente Privado"
            , name: "Escuelas Profesionales de la Sagrada Familia-Nuestra Señora de los Reyes"
            , ownership: "Concertado"
            , domicile: "C/ Calatrava  38"
            , locality: "Sevilla"
            , phone: 954370550
            , lat: 37.402487106403115
            , lon: -5.994517207145691
            , sports_education: 0
            , country: "Spain"
            , monthStart: 10
        },
        {
            id: 7
            , center: "Centro Docente Privado"
            , name: "María Inmaculada"
            , ownership: "Concertado"
            , domicile: "C/ Santa Vicenta María  7"
            , locality: "Sevilla"
            , phone: 954224148
            , lat: 37.393466097
            , lon: -5.99752161
            , sports_education: 1
            , country: "Spain"
            , monthStart: 12
        },
        {
            id: 8
            , center: "Centro Docente Privado"
            , name: "Ntra. Sra. de la Merced"
            , ownership: "Concertado"
            , domicile: "C/ San Vicente  104"
            , locality: "Sevilla"
            , phone: 954387109
            , lat: 37.399998405
            , lon: -5.997883649
            , sports_education: 1
            , country: "Spain"
            , monthStart: 6
        },
        {
            id: 9
            , center: "Centro Docente Privado"
            , name: "Julio César"
            , ownership: "Privado"
            , domicile: "C/ Dalia  1"
            , locality: "Sevilla"
            , phone: 954384911
            , lat: 37.399469242
            , lon: -5.996721881
            , sports_education: 0
            , country: "Spain"
            , monthStart: 3
        },
        {
            id: 10
            , center: "Centro Docente Privado"
            , name: "María Auxiliadora"
            , ownership: "Concertado"
            , domicile: "C/ San Vicente  95"
            , locality: "Sevilla"
            , phone: 954902121
            , lat: 37.39891168077023
            , lon: -5.998760461807251
            , sports_education: 0
            , country: "Spain"
            , monthStart: 6
        },
        {
            id: 11
            , center: "Centro Docente Privado"
            , name: "Sagrado Corazón"
            , ownership: "Concertado"
            , domicile: "C/ Virgen de los Buenos Libros  2"
            , locality: "Sevilla"
            , phone: 954220994
            , lat: 37.394084033
            , lon: -5.997670461
            , sports_education: 1
            , country: "Spain"
            , monthStart: 8
        },
        {
            id: 12
            , center: "Centro de Educación Infantil"
            , name: "Petits 2"
            , ownership: "Privado"
            , domicile: "C/ Juan Rabadán  s/n. Plaza del Bajondillo  locales 1  2  3 y 4"
            , locality: "Sevilla"
            , phone: 647802795
            , lat: 37.39735330225255
            , lon: -5.998249027710017
            , sports_education: 0
            , country: "Spain"
            , monthStart: 11
        },
        {
            id: 13
            , center: "Centro de Educación Infantil"
            , name: "Dino"
            , ownership: "Privado"
            , domicile: "C/ Miguel Cid  70"
            , locality: "Sevilla"
            , phone: 954902022
            , lat: 37.3973700001
            , lon: -5.99828600002
            , sports_education: 0
            , country: "Spain"
            , monthStart: 2
        },
        {
            id: 14
            , center: "Centro de Educación Infantil"
            , name: "San Gil"
            , ownership: "Privado"
            , domicile: "C/ Parras  17"
            , locality: "Sevilla"
            , phone: 955289886
            , lat: 37.401490627273
            , lon: -5.9904104270658
            , sports_education: 1
            , country: "Spain"
            , monthStart: 7
        },
        {
            id: 15
            , center: "Centro de Educación Infantil"
            , name: "Nemomarlin Torneo"
            , ownership: "Privado"
            , domicile: "C/ Torneo  21 Ac"
            , locality: "Sevilla"
            , phone: 661137300
            , lat: 37.47242
            , lon: -4.42523
            , sports_education: 0
            , country: "Spain"
            , monthStart: 3
        },
        {
            id: 16
            , center: "Centro de Educación Infantil"
            , name: "Élite College"
            , ownership: "Privado"
            , domicile: "C/ Cardenal Spínola  18"
            , locality: "Sevilla"
            , phone: 618811901
            , lat: 37.3963896734066
            , lon: -5.99684707332385
            , sports_education: 1
            , country: "Spain"
            , monthStart: 2
        },
        {
            id: 17
            , center: "Colegio de Educación Infantil y Primaria"
            , name: "Altos Colegios Macarena"
            , ownership: "Público"
            , domicile: "C/ Feria  167"
            , locality: "Sevilla"
            , phone: 955624785
            , lat: 37.4030794429259
            , lon: -5.9920334815979
            , sports_education: 0
            , country: "Spain"
            , monthStart: 9
        },
        {
            id: 18
            , center: "Conservatorio Profesional de Música"
            , name: "Cristóbal de Morales"
            , ownership: "Público"
            , domicile: "C/ Jesús del Gran Poder  49"
            , locality: "Sevilla"
            , phone: 955623358
            , lat: 37.3969385182526
            , lon: -5.99540501832962
            , sports_education: 0
            , country: "Spain"
            , monthStart: 10
        },
        {
            id: 19
            , center: "Conservatorio Superior de Música"
            , name: "Manuel Castillo"
            , ownership: "Público"
            , domicile: "C/ Baños  48"
            , locality: "Sevilla"
            , phone: 677903762
            , lat: 37.395493772365015
            , lon: -6.000123023986816
            , sports_education: 0
            , country: "Spain"
            , monthStart: 4
        },
        {
            id: 20
            , center: "Escuela Superior de Arte Dramático"
            , name: ""
            , ownership: "Público"
            , domicile: "C/ Pascual de Gayangos  33"
            , locality: "Sevilla"
            , phone: 954915974
            , lat: 37.396594394
            , lon: -5.999938847
            , sports_education: 1
            , country: "Spain"
            , monthStart: 6
        },
        {
            id: 21
            , center: "Instituto de Educación Secundaria"
            , name: "San Isidoro"
            , ownership: "Público"
            , domicile: "C/ Amor de Dios  28"
            , locality: "Sevilla"
            , phone: 954383411
            , lat: 37.39556645762636
            , lon: -5.994017934333833
            , sports_education: 0
            , country: "Spain"
            , monthStart: 1
        },
        {
            id: 22
            , center: "Centro Docente Privado"
            , name: "Instituto Técnico Superior de Informática Studium II"
            , ownership: "Privado"
            , domicile: "C/ Sol  20"
            , locality: "Sevilla"
            , phone: 954211283
            , lat: 37.3946178
            , lon: -5.986556788
            , sports_education: 0
            , country: "Spain"
            , monthStart: 9
        },
        {
            id: 23
            , center: "Centro Docente Privado"
            , name: "Luisa de Marillac"
            , ownership: "Concertado"
            , domicile: "C/ Socorro  18"
            , locality: "Sevilla"
            , phone: 954228636
            , lat: 37.39578328
            , lon: -5.987145148
            , sports_education: 0
            , country: "Spain"
            , monthStart: 2
        },
        {
            id: 24
            , center: "Centro Docente Privado"
            , name: "Sopeña"
            , ownership: "Concertado"
            , domicile: "C/ Juan de Vera  2"
            , locality: "Sevilla"
            , phone: 954423155
            , lat: 37.390526689
            , lon: -5.983006602
            , sports_education: 1
            , country: "Spain"
            , monthStart: 4
        },
        {
            id: 25
            , center: "Centro Docente Privado"
            , name: "Ángela Guerrero"
            , ownership: "Concertado"
            , domicile: "C/ Doña María Coronel  13"
            , locality: "Sevilla"
            , phone: 954293241
            , lat: 37.393985069943675
            , lon: -5.989426374435425
            , sports_education: 0
            , country: "Spain"
            , monthStart: 6
        },
        {
            id: 26
            , center: "Centro Docente Privado"
            , name: "Santo Tomás de Aquino"
            , ownership: "Privado"
            , domicile: "C/ Recaredo  31"
            , locality: "Sevilla"
            , phone: 954419155
            , lat: 37.391571639
            , lon: -5.984086965
            , sports_education: 0
            , country: "Spain"
            , monthStart: 5
        },
        {
            id: 27
            , center: "Centro Docente Privado"
            , name: "Calderón de la Barca"
            , ownership: "Concertado"
            , domicile: "C/ Castellar  52"
            , locality: "Sevilla"
            , phone: 954223332
            , lat: 37.396351842
            , lon: -5.988534225
            , sports_education: 0
            , country: "Spain"
            , monthStart: 11
        },
        {
            id: 28
            , center: "Centro Docente Privado"
            , name: "Itálica"
            , ownership: "Concertado"
            , domicile: "C/ Arguijo  5"
            , locality: "Sevilla"
            , phone: 954213166
            , lat: 37.39326575
            , lon: -5.992985196
            , sports_education: 1
            , country: "Spain"
            , monthStart: 5
        },
        {
            id: 29
            , center: "Centro Docente Privado"
            , name: "Santa Isabel"
            , ownership: "Concertado"
            , domicile: "C/ Hiniesta  2"
            , locality: "Sevilla"
            , phone: 954216463
            , lat: 37.39693212563302
            , lon: -5.986840724945068
            , sports_education: 0
            , country: "Spain"
            , monthStart: 12
        },
        {
            id: 30
            , center: "Centro Docente Privado"
            , name: "Beaterio de la Santísima Trinidad"
            , ownership: "Concertado"
            , domicile: "C/ Santa Lucía  2"
            , locality: "Sevilla"
            , phone: 954410254
            , lat: 37.397338484
            , lon: -5.982294261
            , sports_education: 1
            , country: "Spain"
            , monthStart: 3
        }
    ],function(err,docsInserted){
        res.sendStatus(201);
    });
}