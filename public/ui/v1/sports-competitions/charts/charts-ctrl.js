angular
    .module("SOS1819-15App")
    .controller("ChartsCtrlSportsCompetitions", function ($scope, $http, $rootScope) {
        console.log("ChartsCtrl loaded.");
        var API = "/api/v2/sports-competitions";

        initializeApp();

        function initializeApp() {
            refresh(undefined, undefined);
        }

        // 1st Chart: pieChart through HighChart.
        function createPieDataChart() {
            var result = $scope.competitions.reduce(function (res, obj) {
                if (!(obj.activity in res))
                    res.__array.push(res[obj.activity] = obj);
                else {
                    res[obj.activity].lengthactivity += obj.lengthactivity;
                    res[obj.activity].inscriptionprice += obj.inscriptionprice;
                }
                return res;
            }, {__array: []}).__array
                .sort(function (a, b) {
                    return b.lengthactivity - a.lengthactivity;
                });
            var chartData = result
                .map(function (item) {
                    return [item.activity, item.lengthactivity, item.inscriptionprice];
                });
            loadPieChart(chartData);
            console.log(result);
            console.log(chartData);
        }

        function loadPieChart(chartData) {
            console.log("Drawing Pie Chart");
            Highcharts.chart('pieChartContainer', {
                chart: {
                    type: 'variablepie'
                },
                title: {
                    text: 'Activities compared by activity length and price in Seville.'
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                        'Length (hours): <b>{point.y}</b><br/>' +
                        'Price (€): <b>{point.z}</b><br/>'
                },
                series: [{
                    minPointSize: 10,
                    innerSize: '75%',
                    zMin: 0,
                    name: 'activities',
                    data: chartData
                }]
            });
        }

        function loadGeoChartData() {
            var geoChartData = [
                [['Latitude', 'Longitude'], 'Competición', 'Fecha']
            ];
            $scope.competitions.forEach(function (competition) {
                [[41.151636,-8.569336,0,'tooltip']]
                geoChartData.push([
                    competition.latitude,
                    competition.longitude,
                    competition.name+" "+competition.day+"/"+competition.month+"/"+competition.year
                ]);
            });
            loadGeoChart(geoChartData);
        }

        function loadGeoChart(geoData) {
            google.charts.setOnLoadCallback(drawMarkersMap);

            function drawMarkersMap() {
                google.charts.load('current', {
                    'packages':['geochart'],
                    // Note: you will need to get a mapsApiKey for your project.
                    // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                    'mapsApiKey': 'AIzaSyAA0viQhdEMAJcfUYG_mtUB6ke8Rs6XjyM'
                });
                google.charts.setOnLoadCallback(drawRegionsMap);

                function drawRegionsMap() {
                    var data = google.visualization.arrayToDataTable(geoData);
                    var options = {};
                    var chart = new google.visualization.GeoChart(document.getElementById('geo_chart_div'));
                    $("#geo_chart_div").css("zoom",1);
                    google.visualization.events.addListener(chart, 'ready', function() { $("#geo_chart_div").css("zoom",1.0); });
                    chart.draw(data, {region:"ES", displayMode: "markers", resolution:"provinces"});
                }

            };
        }

        // 2nd Chart:
        function createAreaDataChart() {
            var chartData = $scope.competitions
                .map(function (item) {
                    return [item.month, item.activity, 0, 0];
                });

            var chartAreaData = chartData.reduce(function (res, obj) {
                if (!(obj[0] in res))
                    if (obj[1] === "Escolar") {
                        res.__array.push(res[obj[0]] = [obj[0], 1, 0]);
                    } else {
                        res.__array.push(res[obj[0]] = [obj[0], 0, 1]);
                    }
                else {
                    if (obj[1] === "Escolar") {
                        res[obj[0]][1] += 1;
                    } else {
                        res[obj[0]][2] += 1;
                    }
                }
                return res;
            }, {__array: []}).__array
                .sort(function (a, b) {
                    return a[0] - b[0];
                });
            chartAreaData.splice(0, 0, ['Month', 'Scholar', 'General']);
            //console.log(chartAreaData);
            loadAreaChart(chartAreaData);
        }

        function loadAreaChart(chartAreaData) {
            google.charts.load('current', {'packages': ['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(chartAreaData);

                var options = {
                    title: 'Activities organized by month and activity type.',
                    hAxis: {title: 'Month', titleTextStyle: {color: '#333'}},
                    vAxis: {minValue: 0}
                };

                var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
                chart.draw(data, options);
            }
        }


        function refresh(limit, offset) {
            $scope.showInfoComp = false;
            $scope.showInfoNone = true;
            //console.log("Requesting competitions to <" + API + "?fromMonth=" + $scope.fromMonth + "&toMonth=" + $scope.toMonth + ">");
            var url = API +
                "?fromMonth=" + parseInt($scope.fromMonth) +
                "&toMonth=" + parseInt($scope.toMonth) +
                "&limit=" + parseInt(limit) +
                "&offset=" + parseInt($scope.offset);
            console.log("Requesting competitions to <" + url + ">");
            $http.get(url).then(function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
                $scope.competitions = response.data;
                createPieDataChart();
                createAreaDataChart();
                loadGeoChartData();
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });
        }

    });
