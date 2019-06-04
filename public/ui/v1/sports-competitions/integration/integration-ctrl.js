angular
    .module("SOS1819-15App")
    .controller("IntegrationCtrlCompetitions", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function ($scope, $http, $routeParams, $location, $rootScope) {

        var API = "/api/v2/sports-competitions";
        // SOS partners APIs
        var sosAPIg06 = "https://sos1819-06.herokuapp.com/api/v1/transfer-stats/";
        var soslAPIg12 = "https://sos1819-12.herokuapp.com/api/v1/youth-unemployment-stats";
        var proxyTransferStats = "/proxy/transfer-stats";
        var proxyYouthStats = "/proxy/youth-unemployment-stats";

        // External APIS
        var proxyNewyorkTimes = "/proxy/newyorkTimes";
        var proxyVideogames = "/proxy/videogames";
        var proxyspaceX = "/proxy/spaceX";
        refresh();

        function refresh() {
            // API 1
            console.log("Requesting to < " + sosAPIg06 + " >");
            $http.get(sosAPIg06).then(function (response) {
                $scope.transfers = response.data;
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });

            // API 2
            console.log("Requesting to < " + proxyYouthStats + " >");
            $http.get(proxyYouthStats).then(function (response) {
                $scope.unemploymentsStats = response.data;
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });

            // API 3
            console.log("Requesting to < " + proxyNewyorkTimes + " >");
            $http.get(proxyNewyorkTimes).then(function (response) {
                $scope.moviesReviews = response.data.results;
                barChar();
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });

            // API 4
            console.log("Requesting to < " + proxyVideogames + " >");
            $http.get(proxyVideogames).then(function (response) {
                $scope.videoGames = response.data.results;
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });
            // API 5
            console.log("Requesting to < " + proxyspaceX + " >");
            $http.get(proxyspaceX).then(function (response) {
                $scope.launches = response.data;
                bubble_chart();
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });

            // API 6
            console.log("Requesting to < " + "/auth0/thenoun/" + " >");
            $http.get("/auth0/thenoun/").then(function (response) {
                $scope.auth0API = response.data;
                console.log($scope.auth0API)
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });
        }


        // For api 3
        function barChar() {
            var data = [];
            $scope.moviesReviews.forEach(function (movie) {
                data.push([movie.mpaa_rating, 0]);
            });
            var result = data.reduce(function (res, obj) {
                if (!(obj[0] in res))
                    res.__array.push(res[obj[0]] = obj);
                else {
                    res[obj[0]][1] += 1;
                }
                return res;
            }, {__array: []}).__array
                .sort(function (a, b) {
                    return b.lengthactivity - a.lengthactivity;
                });
            result.splice(0, 0, ['Rating', 'Num']);
            google.charts.load('current', {packages: ['corechart', 'bar']});
            google.charts.setOnLoadCallback(drawStacked);

            function drawStacked() {
                var data = new google.visualization.arrayToDataTable(result);


                var options = {
                    title: 'Reviews de películas por evaluación de público',
                    isStacked: true,
                    hAxis: {
                        title: 'Evaluación',
                        format: 'h:mm a',
                    },
                    vAxis: {
                        title: 'Cantidad'
                    }
                };

                var chart = new google.visualization.ColumnChart(document.getElementById('bar_chart'));
                chart.draw(data, options);
            }
        }

        // For APi 5
        function bubble_chart() {
            console.log("Drawing Area Chart");
            var anios = ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2018', '2019'];
            var exito = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var fallo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.launches.forEach(function (launch) {
                var pos = anios.indexOf(launch.launch_year);
                if (launch.launch_success === false) {
                    fallo[pos] += 1;
                } else {
                    exito[pos] += 1;
                }
            });
            var dataExito = [];
            var dataFallo = [];
            for (i = 0; i < anios.length; i++) {
                dataExito.push([anios[i], exito[i]]);
                dataFallo.push([anios[i], fallo[i]]);
            }
            var dataAll = [
                dataExito, dataFallo
            ];

            var markLineOpt = {
                animation: false,
                label: {
                    normal: {
                        formatter: 'y = 0.5 * x + 3',
                        textStyle: {
                            align: 'right'
                        }
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                tooltip: {
                    formatter: 'y = 0.5 * x + 3'
                },
                data: [[{
                    coord: [0, 3],
                    symbol: 'none'
                }, {
                    coord: [0, 3],
                    symbol: 'none'
                }]]
            };

            option = {
                title: {
                    text: '',
                    x: 'center',
                    y: 0
                },
                grid: [
                    {x: '7%', y: '7%', width: '38%', height: '50%'},
                    {x2: '7%', y: '7%', width: '38%', height: '50%'}
                ],
                tooltip: {
                    formatter: 'Grupo {a}: ({c})'
                },
                xAxis: [
                    {gridIndex: 0, min: 2006, max: 2019},
                    {gridIndex: 1, min: 2006, max: 2019}
                ],
                yAxis: [
                    {gridIndex: 0, min: 0, max: 25},
                    {gridIndex: 1, min: 0, max: 25}
                ],
                series: [
                    {
                        name: 'Exitos',
                        type: 'scatter',
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: dataAll[0],
                        markLine: markLineOpt
                    },
                    {
                        name: 'Fallos',
                        type: 'scatter',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: dataAll[1],
                        markLine: markLineOpt
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById('bubble_chart'));
            myChart.setOption(option);
        }
    }]);