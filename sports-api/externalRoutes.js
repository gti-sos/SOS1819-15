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
    });


module.exports = router;