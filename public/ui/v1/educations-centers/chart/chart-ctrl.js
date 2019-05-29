angular
    .module("SOS1819-15App")
    .controller("ChartCtrlEducations", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function ($scope, $http, $routeParams, $location, $rootScope) {
        // Set up the chart

        $scope.url = "/api/v1/educations-centers";
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
            }, function (response) {
                $scope.dataResponse = response.status + ", " + response.statusText
            });
        }



    }]);