angular
    .module("SOS1819-15App")
    .controller("IntegrationCtrlEducations", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function ($scope, $http, $routeParams, $location, $rootScope) {
        // Set up the chart

        var yearList = [];
        var yearCountCenter = [];
        var yearCountDisaster = [];

        $scope.url = "/api/v2/educations-centers";
        var proxyOneURL = "/proxy/major-disasters";
        var proxyTwoURL = "/proxy/pollution-stats";
        refresh();

        function refresh() {
            $http.get($scope.url).then(function (response) {
                var res = JSON.stringify(response.data, null, 2);
                if (response.data.length === 0) {

                }
                console.log(response.data);

                for (i = 1980; i <= 2010; i++) {
                    yearCountCenter.push(response.data.filter(center => center.yearStart === i).length);
                    yearList.push(i);
                }

                $http.get(proxyOneURL).then(function (response) {
                    createMajorDisaster(response);
                });

                $http.get(proxyTwoURL).then(function (response) {
                    createPollutionStats(response);
                });

                $http.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Clitecoin%2Cdash%2Cripple%2Cmonero&vs_currencies=usd").then(function (response) {
                    getBitCoin(response)
                });

                $http.get("https://api.punkapi.com/v2/beers").then(function (response) {
                    getNationalGrid(response)
                });

                $http.get("https://pokeapi.co/api/v2/generation/1").then(function (response1) {
                    $http.get("https://pokeapi.co/api/v2/generation/2").then(function (response2) {
                        $http.get("https://pokeapi.co/api/v2/generation/3").then(function (response3) {
                            $http.get("https://pokeapi.co/api/v2/generation/4").then(function (response4) {
                                $http.get("https://pokeapi.co/api/v2/generation/5").then(function (response5) {
                                    getPokemon(
                                        response1.data.pokemon_species.length,
                                        response2.data.pokemon_species.length,
                                        response3.data.pokemon_species.length,
                                        response4.data.pokemon_species.length,
                                        response5.data.pokemon_species.length
                                        );
                                });
                            });
                        });
                    });
                });


                $http.get("https://rickandmortyapi.com/api/character/").then(function (response) {
                    console.log(response.data);
                    getRick(response)
                });

                $http.get("https://data.police.uk/api/stops-force?force=avon-and-somerset&date=2018-04").then(function (response) {
                    getPolice(response)
                });

                $http.get("https://api.citybik.es/v2/networks/sevici").then(function (response) {
                    getSevici(response)
                });




            }, function (response) {
                $scope.dataResponse = response.status + ", " + response.statusText
            });
        }

        function createMajorDisaster(response) {
            for (i = 1980; i <= 2010; i++) {
                yearCountDisaster.push(response.data.filter(center => center.year === i).length);
            }

            var trace1 = {
                type: "scatter",
                mode: "lines",
                x: yearList,
                y: yearCountCenter,
                line: {color: '#17BECF'}
            };

            var trace2 = {
                type: "scatter",
                mode: "lines",
                x: yearList,
                y: yearCountDisaster,
                line: {color: '#7F7F7F'}
            };

            var data = [trace1, trace2];

            var layout = {
                title: 'Custom Range',
                xaxis: {
                    range: ['1980', '2010'],
                    type: 'date'
                },
                yaxis: {
                    autorange: true,
                    range: [86.8700008333, 138.870004167],
                    type: 'linear'
                }
            };

            Plotly.newPlot('sos1', data, layout, {showSendToCloud: true});
        }

        function createPollutionStats(response) {

            yearCountDisaster.push(response.data.filter(center => center.year === i).length);

            Highcharts.chart('container-pollution', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Relación pais y contaminación percapita'
                },
                xAxis: {
                    categories: ['España', 'Alemania', 'Reino Unido', 'Francia', 'Italia']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Contaminación per capita'
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [{
                    name: '2015',
                    data: [
                        response.data.filter(center => center.country === "spain" && center.year === 2015)[0].pollution_perca
                        , response.data.filter(center => center.country === "alemania" && center.year === 2015)[0].pollution_perca
                        , response.data.filter(center => center.country === "reino unido" && center.year === 2015)[0].pollution_perca
                        , response.data.filter(center => center.country === "francia" && center.year === 2015)[0].pollution_perca
                        , response.data.filter(center => center.country === "italia" && center.year === 2015)[0].pollution_perca]
                }, {
                    name: '2016',
                    data: [
                        response.data.filter(center => center.country === "spain" && center.year === 2016)[0].pollution_perca
                        , response.data.filter(center => center.country === "alemania" && center.year === 2016)[0].pollution_perca
                        , response.data.filter(center => center.country === "reino unido" && center.year === 2016)[0].pollution_perca
                        , response.data.filter(center => center.country === "francia" && center.year === 2016)[0].pollution_perca
                        , response.data.filter(center => center.country === "italia" && center.year === 2016)[0].pollution_perca]
                }, {
                    name: '2017',
                    data: [
                        response.data.filter(center => center.country === "spain" && center.year === 2017)[0].pollution_perca
                        , response.data.filter(center => center.country === "alemania" && center.year === 2017)[0].pollution_perca
                        , response.data.filter(center => center.country === "reino unido" && center.year === 2017)[0].pollution_perca
                        , response.data.filter(center => center.country === "francia" && center.year === 2017)[0].pollution_perca
                        , response.data.filter(center => center.country === "italia" && center.year === 2017)[0].pollution_perca]
                }]
            });
        }

        function getBitCoin(response) {

            var listCoins = [];

            for (i = 0; i < response.length; i++) {
                listCoins.push(response.data[i].usd);
            }
            var oilCanvas = document.getElementById("oilChart");

            var oilData = {
                labels: [
                    "Bitcoin",
                    "Dash",
                    "Ethereum",
                    "Litecoin",
                    "Monero",
                    "Ripple"
                ],
                datasets: [
                    {
                        data: [response.data.bitcoin.usd,
                            response.data.dash.usd,
                            response.data.ethereum.usd,
                            response.data.litecoin.usd,
                            response.data.monero.usd,
                            response.data.ripple.usd],
                        backgroundColor: [
                            "#FF6384",
                            "#63FF84",
                            "#84FF63",
                            "#8463FF",
                            "#6384FF",
                            "#aa0006"
                        ]
                    }]
            };

            var pieChart = new Chart(oilCanvas, {
                type: 'pie',
                data: oilData
            });
        }

        function getNationalGrid(response) {

            $scope.factors = response.data


        }

        function getRick(response) {

            $scope.ricks = response.data.results


        }

        function getPolice(response){

            var nameListPolice = [];
            var latPolice = [];
            var lonPolice = [];

            for (i = 0; i < response.data.length; i++) {
                if(response.data[i].location != null){
                    nameListPolice.push(response.data[i].legislation);
                    latPolice.push(response.data[i].location.latitude);
                    lonPolice.push(response.data[i].location.longitude);
                }
            }

            var data = [{
                type: 'scattermapbox',
                mode: 'markers+text',
                text: nameListPolice,
                lon: lonPolice,
                lat: latPolice,
                marker: {
                    size: 7,
                    color: '#da0034',
                    line: {
                        width: 1
                    }
                },
                name: 'Delitos'
            }];

            var layout = {
                font: {
                    color: 'white'
                },
                dragmode: 'zoom',
                mapbox: {
                    center: {
                        lat: 51.2115,
                        lon: -2.6436
                    },
                    domain: {
                        x: [0, 1],
                        y: [0, 1]
                    },
                    zoom: 8
                },
                margin: {
                    r: 20,
                    t: 40,
                    b: 20,
                    l: 20,
                    pad: 0
                },
                showlegend: true,
                annotations: [{
                    x: 0,
                    y: 0,
                    xref: 'paper',
                    yref: 'paper',
                    text: 'Source: <a href="https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh" style="color: rgb(255,255,255)">NASA</a>',
                    showarrow: false
                }]
            };

            Plotly.setPlotConfig({
                mapboxAccessToken: 'pk.eyJ1IjoiZGFucmFtaXJleiIsImEiOiJjandiNnJwdWwwOTJvM3ludjJ1ZjFsNGRrIn0.4Dtx2mdBN8juQzEGD1TdEw'
            });

            Plotly.newPlot('map', data, layout);
        }

        function getSevici(response) {

            function compare( a, b ) {
                if ( a.free_bikes > b.free_bikes ){
                    return -1;
                }
                if ( a.free_bikes < b.free_bikes ){
                    return 1;
                }
                return 0;
            }

            var seviciTest = response.data.network.stations.sort(compare).slice(0, 10);

            $scope.sevicis = seviciTest

        }

        function getPokemon(poke1, poke2, poke3, poke4, poke5) {

            console.log(poke1);
            console.log(poke2);
            console.log(poke3);
            console.log(poke4);
            console.log(poke5);

            new Chart(document.getElementById("radar-chart"), {
                type: 'radar',
                data: {
                    labels: ["Generación 1", "Generación 2", "Generación 3", "Generación 4", "Generación 5"],
                    datasets: [
                        {
                            label: "Cantidad de Pokemon por generación",
                            fill: true,
                            backgroundColor: "rgba(179,181,198,0.2)",
                            borderColor: "rgba(179,181,198,1)",
                            pointBorderColor: "#fff",
                            pointBackgroundColor: "rgba(179,181,198,1)",
                            data: [poke1,poke2,poke3,poke4,poke5]
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Cantidad de Pokemon por generación'
                    }
                }
            });


        }

    }]);