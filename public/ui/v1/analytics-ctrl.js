angular
    .module("SOS1819-15App")
    .controller("AnalyticsCtrl", function ($scope, $http) {
        console.log("AnalyticsCtrl loaded.");
        var sportscompetitionsAPI = "/api/v2/sports-competitions";
        var educenterAPI = "/api/v2/educations-centers";
        var sportcenterAPI = "/api/v1/sports-centers";
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

        function apiG06Charts(){
            Highcharts.chart('highChartBar', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Historic World Population by Region'
                },
                subtitle: {
                    text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
                },
                xAxis: {
                    categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Population (millions)',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' millions'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Year 1800',
                    data: [107, 31, 635, 203, 2]
                }, {
                    name: 'Year 1900',
                    data: [133, 156, 947, 408, 6]
                }, {
                    name: 'Year 2000',
                    data: [814, 841, 3714, 727, 31]
                }, {
                    name: 'Year 2016',
                    data: [1216, 1001, 4436, 738, 40]
                }]
            });
        }

        function refresh(limit, offset) {
            console.log("Requesting competitions to <" + sportscompetitionsAPI + ">");
            $http.get(sportscompetitionsAPI).then(function (response) {
                $scope.competitions = response.data;
                //console.log($scope.competitions);
                console.log("Requesting competitions to <" + educenterAPI + ">");
                $http.get(educenterAPI).then(function (response) {
                    $scope.centers = response.data;
                    //console.log($scope.centers);
                    console.log("Requesting competitions to <" + sportcenterAPI + ">");
                    $http.get(sportcenterAPI).then(function (response) {
                        $scope.sportcenter = response.data;
                        //console.log($scope.sportcenter);
                        var dataChar=[
                            ['Location', 'Parent', 'Día', 'Mes', 'Año'],
                            ['Global',null,0, 0, 0],
                            ['Centro Educativo','Global', 0, 0, 0],
                            ['Centro Deportivo','Global', 0, 0, 0],
                            ['No catalogado','Global', 0, 0, 0],
                        ];

                        $scope.competitions.forEach(function (competition) {
                            if (competition.activity==="Escolar"){
                                var lugar = "";
                                $scope.sportcenter.forEach(function (sprtcenter) {
                                    if(sprtcenter.name.indexOf(competition.sportcenter) > -1) {
                                        lugar=sprtcenter.name;
                                    }
                                });
                                if (lugar ===""){
                                    dataChar.push([
                                        competition.name,
                                        "Centro Educativo",
                                        competition.day, competition.month,competition.year
                                    ]);
                                }else{
                                    dataChar.push([
                                        competition.name,
                                        "No catalogado",
                                        competition.day, competition.month,competition.year
                                    ]);
                                }
                            }else{
                                var lugar = "";
                                $scope.centers.forEach(function (center) {
                                    if(center.name.indexOf(competition.schoolcenter) > -1) {
                                        lugar=center.name;
                                    }
                                });
                                if (lugar ===""){
                                    dataChar.push([
                                        competition.name,
                                        "Centro Deportivo",
                                        competition.day, competition.month,competition.year
                                    ]);
                                }else{
                                    dataChar.push([
                                        competition.name,
                                        "No catalogado",
                                        competition.day, competition.month,competition.year
                                    ]);
                                }
                            }
                        });
                        //console.log(dataChar);
                        treeMap(dataChar);
                    }, function (response) {
                        console.log("Data received: " + JSON.stringify(response.data, null, 2));
                    });
                }, function (response) {
                    console.log("Data received: " + JSON.stringify(response.data, null, 2));
                });
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });
        }

        function treeMap(dataChar) {
            google.charts.load('current', {'packages':['treemap']});
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var data = google.visualization.arrayToDataTable(dataChar);
                tree = new google.visualization.TreeMap(document.getElementById('tree_map'));
                tree.draw(data, {
                    minColor: '#f00',
                    midColor: '#ddd',
                    maxColor: '#0d0',
                    headerHeight: 15,
                    fontColor: 'black',
                    showScale: true
                });

            }
        }

    });
