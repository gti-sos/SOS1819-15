const express = require('express');
const request = require('request');
var router = express.Router();

router.get('/major-disasters', function (req, res) {
    req.pipe(request('https://sos1819-01.herokuapp.com/api/v1/major-disasters')).pipe(res);
    })

    .get('/pollution-stats', function (req, res) {
        req.pipe(request('https://sos1819-12.herokuapp.com/api/v1/pollution-stats')).pipe(res);
    })

    .get('/youth-unemployment-stats', function (req, res) {
        req.pipe(request('https://sos1819-12.herokuapp.com/api/v1/youth-unemployment-stats')).pipe(res);
    })

    .get('/transfer-stats', function (req, res) {
        req.pipe(request('https://sos1819-06.herokuapp.com/api/v1/transfer-stats')).pipe(res);
    })

    // External APIS
    .get('/newyorkTimes', function (req, res) {
        var id = process.env.NY_APP_ID;
        req.pipe(request('https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key='+id)).pipe(res);
    })
    .get('/spaceX', function (req, res) {
        req.pipe(request('https://api.spacexdata.com/v3/launches/')).pipe(res);
    })
    .get('/videogames', function (req, res) {
        var id = process.env.GIANTBOMB_APP_ID;
        req.pipe(request('https://www.giantbomb.com/api/games/?api_key='+id+'&format=json&sort=date_last_updated:desc&limit=15')).pipe(res);
    });




module.exports = router;