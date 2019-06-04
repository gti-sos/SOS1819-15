angular
    .module("SOS1819-15App")
    .controller("ChartsCtrlSportsCompetitions", function ($scope, $http) {
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

        // 2nd Chart: geoChart through GoogleChart.
        function loadGeoChartData() {
            var geoChartData = [
                [['Latitude', 'Longitude'], 'Competición', 'Fecha']
            ];
            $scope.competitions.forEach(function (competition) {
                geoChartData.push([
                    competition.latitude,
                    competition.longitude,
                    competition.name + " " + competition.day + "/" + competition.month + "/" + competition.year
                ]);
            });
            loadGeoChart(geoChartData);
        }

        function loadGeoChart(geoData) {
            console.log("Drawing Google's geoChart.");
            google.charts.load('current', {
                'packages': ['geochart'],
                // Note: you will need to get a mapsApiKey for your project.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                'mapsApiKey': 'AIzaSyAA0viQhdEMAJcfUYG_mtUB6ke8Rs6XjyM'
            });
            google.charts.setOnLoadCallback(drawRegionsMap);

            function drawRegionsMap() {
                var data = google.visualization.arrayToDataTable(geoData);
                var options = {
                    region: "ES",
                    displayMode: "markers",
                    sizeAxis: {maxValue: 0},
                    resolution: "provinces",
                    backgroundColor: '#80b3ff',
                    datalessRegionColor: '#996633',
                    defaultColor: '#f5f5f5',
                };
                var chart = new google.visualization.GeoChart(document.getElementById('geo_chart_div'));
                $("#geo_chart_div").css("zoom", 1);
                google.visualization.events.addListener(chart, 'ready', function () {
                    $("#geo_chart_div").css("zoom", 1.0);
                });
                chart.draw(data, options);
            }
        }

        // 3rd Chart: areaChart through Echart.
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

            var scholarData = [];
            var generalData = [];
            chartAreaData.forEach(function (data) {
                scholarData.push(data[1]);
                generalData.push(data[2]);
            });
            loadAreaChart(scholarData,generalData);
        }

        function loadAreaChart(chartAreaDataScholar, chartAreaDataGeneral) {
            console.log("Drawing Area Chart");
            option = {
                title: {
                    text: 'Activities by month and type.'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['Escolar', 'General']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [1,2,3,4,5,6,7,8,9,10,11,12]
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Escolar',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: chartAreaDataScholar
                    },
                    {
                        name: 'General',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: chartAreaDataGeneral
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById('areaChartContainer'));
            myChart.setOption(option);
        }

        function refresh(limit, offset) {
            var url = API;
            console.log("Requesting competitions to <" + url + ">");
            $http.get(url).then(function (response) {
                $scope.competitions = response.data;
                createPieDataChart();
                loadGeoChartData();
                createAreaDataChart();
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });
        }

    });
