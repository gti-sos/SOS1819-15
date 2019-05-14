angular
    .module("SportsCompetitionsApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function ($scope, $http, $routeParams, $location, $rootScope) {
        console.log("EditCtrl: Retrieving $scope");

        var API = "/api/v2/sports-competitions";
        var id_route = $routeParams.id;

        initializeEditApp();

        function initializeEditApp() {
            $scope.showAlertSuccessNone = true;
            $scope.showAlertWarningNone = true;
            $scope.showAlertErrorNone = true;
            $scope.showAlertInfoNone = true;
            getComp();
        }

        $scope.clearAlerts = function () {
            clearAlerts();
        }

        function clearAlerts() {
            $scope.showAlertWarning = false;
            $scope.showAlertWarningNone = true;

            $scope.showAlertSuccess = false;
            $scope.showAlertSuccessNone = true;

            $scope.showAlertError = false;
            $scope.showAlertErrorNone = true;

            $scope.showInfoComp = false;
            $scope.showInfoNone = true;

            $scope.showAlertInfo = false;
            $scope.showAlertInfoNone = true;
        }

        function getComp() {
            $http.get(API + "/" + id_route).then(function (response) {
                var res = JSON.stringify(response.data, null, 2);
                if (response.data.length === 0) {

                }
                console.log("RES: " + res);
                $scope.id = parseInt(response.data.id);
                $scope.year = parseInt(response.data.year);
                $scope.day = parseInt(response.data.day);
                $scope.month = parseInt(response.data.month);
                $scope.name = response.data.name;
                $scope.sportcenter = response.data.sportcenter;
                $scope.schoolcenter = response.data.schoolcenter;
                $scope.activity = response.data.activity;
                $scope.lengthactivity = parseInt(response.data.lengthactivity);
                $scope.totaldistance = parseInt(response.data.totaldistance);
                $scope.inscriptionprice = parseInt(response.data.inscriptionprice);
            }, function (response) {
                $scope.dataResponse = response.status + ", " + response.statusText
            });
        };

        $scope.editCompetition = function (id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice) {
            clearAlerts();
            if (!isNaN(id)
                && !isNaN(year)
                && !isNaN(day)
                && !isNaN(month)
                && typeof name !== 'undefined'
                && !isNaN(lengthactivity)
                && !isNaN(totaldistance)
                && !isNaN(inscriptionprice)) {
                if (typeof sportcenter === 'undefined') sportcenter = "";
                if (typeof schoolcenter === 'undefined') schoolcenter = "";
                if (typeof activity === 'undefined') activity = "";

                var data = {
                    id: parseInt(id),
                    year: parseInt(year),
                    day: parseInt(day),
                    month: parseInt(month),
                    name: name,
                    sportcenter: sportcenter,
                    schoolcenter: schoolcenter,
                    activity: activity,
                    lengthactivity: parseInt(lengthactivity),
                    totaldistance: parseInt(totaldistance),
                    inscriptionprice: parseInt(inscriptionprice)
                };
                console.log("Sending competition update to <" + API + id + ">");
                console.log(data);
                $http.put(API + "/" + id, JSON.stringify(data)).then(function (response) {
                    console.log("OK put method, Code " + response.status + ", " + response.statusText);
                    $scope.msgSuccess = "Se ha actualizado la competición con ID: " + id;
                    $scope.showAlertSuccess = true;
                    $scope.showAlertSuccessNone = false;
                }, function (response) {
                    console.log("Error PUT method: Code " + response.status + ", " + response.statusText);
                    $scope.msgError = "No se ha podido modificar la competitición.";
                    $scope.showAlertError = true;
                    $scope.showAlertErrorNone = false;
                });
            } else {
                console.log("Fields required");
                $scope.msgWarning = "Error en los campos, comprueba que son correctos.";
                $scope.showAlertWarning = true;
                $scope.showAlertWarningNone = false;
            }
        }

    }]);
