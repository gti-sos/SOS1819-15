angular
    .module("SOS1819-15App")
    .controller("ChartCtrlEducations", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function ($scope, $http, $routeParams, $location, $rootScope) {
        // Set up the chart

        $scope.url = "/api/v2/educations-centers";
        refresh();

        function refresh() {
            $http.get($scope.url).then(function (response) {
                var res = JSON.stringify(response.data, null, 2);
                if (response.data.length === 0) {

                }
                console.log(response.data);

                var privadoCount = response.data.filter(center => center.ownership === "Privado").length;
                var concertadoCount = response.data.filter(center => center.ownership === "Concertado").length;
                var publicoCount = response.data.filter(center => center.ownership === "Público").length;

                var privadoCountSport = response.data.filter(center => center.ownership === "Privado" && center.sports_education == 1).length;
                var concertadoCountSport = response.data.filter(center => center.ownership === "Concertado" && center.sports_education == 1).length;
                var publicoCountSport = response.data.filter(center => center.ownership === "Público" && center.sports_education == 1).length;

                Highcharts.chart('container', {
                    chart: {
                        type: 'pyramid3d',
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            depth: 50,
                            viewDistance: 50
                        }
                    },
                    title: {
                        text: 'Titularidad de los centros'
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b> ({point.y:,.0f})',
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                allowOverlap: true,
                                x: 10,
                                y: -5
                            },
                            width: '60%',
                            height: '80%',
                            center: ['50%', '45%']
                        }
                    },
                    series: [{
                        name: 'Unique users',
                        data: [
                            ['Público', publicoCount],
                            ['Privado', privadoCount],
                            ['Concertado', concertadoCount]
                        ]
                    }]
                });

                var array = [
                    [ "Latitude", "Longitude" ]
                ];

                var nameList = [
                ];

                var latList = [
                ];

                var lonList = [
                ];

                response.data.forEach(function(element) {
                    array.push([element.lat,element.lon]);
                    nameList.push(element.name);
                    latList.push(element.lat);
                    lonList.push(element.lon);
                });


                google.charts.load('current', {
                    'packages':['geochart'],
                    // Note: you will need to get a mapsApiKey for your project.
                    // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                    'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
                });
                google.charts.setOnLoadCallback(drawRegionsMap);

                function drawRegionsMap() {
                    var data = google.visualization.arrayToDataTable(array);

                    var options = {};

                    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

                    chart.draw(data, {region:"ES", displayMode: "markers"});
                }


                var data = [{
                    type: 'scattermapbox',
                    mode: 'markers+text',
                    text: nameList,
                    lon: lonList,
                    lat: latList,
                    marker: {
                        size: 7,
                        color: '#bebada',
                        line: {
                            width: 1
                        }
                    },
                    name: 'europe data'
                }];

                var layout = {
                    font: {
                        color: 'white'
                    },
                    dragmode: 'zoom',
                    mapbox: {
                        center: {
                            lat: 37.395,
                            lon: -5.994
                        },
                        domain: {
                            x: [0, 1],
                            y: [0, 1]
                        },
                        style: 'dark',
                        zoom: 14
                    },
                    margin: {
                        r: 20,
                        t: 40,
                        b: 20,
                        l: 20,
                        pad: 0
                    },
                    paper_bgcolor: '#191A1A',
                    plot_bgcolor: '#191A1A',
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

                Plotly.newPlot('myDiv', data, layout);


                var trace1 = {
                    x: ['Privados', 'Concertado', 'Publico'],
                    y: [privadoCountSport, concertadoCountSport, publicoCountSport],
                    type: 'bar',
                    text: [' centros con educación deportiva', ' centros con educación deportiva', ' centros con educación deportiva'],
                    marker: {
                        color: 'rgb(142,124,195)'
                    }
                };

                var dataTwo = [trace1];

                var layoutTwo = {
                    title: 'Numeros de educación deportiva por titularidad de los centros',
                    font:{
                        family: 'Raleway, sans-serif'
                    },
                    showlegend: false,
                    xaxis: {
                        tickangle: -45
                    },
                    yaxis: {
                        zeroline: false,
                        gridwidth: 2
                    },
                    bargap :0.05
                };

                Plotly.newPlot('myDivTwo', dataTwo, layoutTwo);

            }, function (response) {
                $scope.dataResponse = response.status + ", " + response.statusText
            });
        }





    }]);