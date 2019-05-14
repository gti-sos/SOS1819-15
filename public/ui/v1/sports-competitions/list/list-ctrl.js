angular
    .module("SportsCompetitionsApp")
    .controller("ListCtrl", function ($scope, $http, $rootScope, autoLoad) {
        console.log("Retrieving $scope");
        var API = "/api/v2/sports-competitions";

        initializeApp();

        function initializeApp() {
            refresh(undefined, undefined);
            $scope.limit = 10;
            $scope.offset = 0;
            $scope.numCompetitions = 0;

            $scope.showInfoComp = false;
            $scope.showInfoNone = true;

            $scope.showAlertSuccessNone = true;
            $scope.showAlertWarningNone = true;
            $scope.showAlertErrorNone = true;
            $scope.showAlertInfoNone = true;
        }

        $scope.loadInitialData = function () {
            $http.get(API + "/loadInitialData").then(function (response) {
                refresh(undefined, undefined);
            });
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
                $scope.numCompetitions = Object.keys(response.data).length;
                if (Object.keys(response.data).length === 0) {
                    $scope.showInfoComp = true;
                    $scope.showInfoNone = false;
                } else {

                }
            }, function (response) {
                console.log("Data received: " + JSON.stringify(response.data, null, 2));
            });
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

        $scope.search = function () {
            clearAlerts();
            refresh(undefined, undefined);
        }

        $scope.pagination = function (page) {
            clearAlerts();
            console.log("Paginating sports competitions");
            if (isNaN(page)) {
                if (page.localeCompare("forward") == 0) {
                    if ($scope.numCompetitions >= $scope.limit) {
                        refresh($scope.limit, $scope.offset);
                        $scope.offset += $scope.limit;
                    }
                } else if (page.localeCompare("back") == 0) {
                    if ($scope.offset > 0) {
                        $scope.offset -= $scope.limit;
                    }
                    refresh($scope.limit, $scope.offset);
                } else {
                    $scope.offset = 0;
                    refresh(undefined, undefined);
                }
            } else {
                $scope.offset = page * $scope.limit;
                refresh($scope.limit, $scope.offset);
            }
        }

        $scope.addCompetition = function () {
            clearAlerts();
            var newCompetition = $scope.newCompetition;

            console.log("Adding a new competition. " + JSON.stringify(newCompetition));
            if (typeof (newCompetition) !== "undefined") {
                if (!isNaN(newCompetition.id)
                    && !isNaN(newCompetition.year)
                    && !isNaN(newCompetition.day)
                    && !isNaN(newCompetition.month)
                    && typeof newCompetition.name !== 'undefined'
                    && !isNaN(newCompetition.lengthactivity)
                    && !isNaN(newCompetition.totaldistance)
                    && !isNaN(newCompetition.inscriptionprice)) {

                    if (typeof newCompetition.sportcenter === 'undefined') newCompetition.sportcenter = "";
                    if (typeof newCompetition.schoolcenter === 'undefined') newCompetition.schoolcenter = "";
                    if (typeof newCompetition.activity === 'undefined') newCompetition.activity = "";

                    $http.post(API, JSON.stringify(newCompetition)).then(function (response) {
                        console.log("POST response " + response.status + " " +
                            response.data);
                        $scope.msgSuccess = "Se ha añadido la nueva competición.";
                        $scope.showAlertSuccess = true;
                        $scope.showAlertSuccessNone = false;
                        refresh(undefined, undefined);
                    }, function (response) {
                        switch (response.status) {
                            case 409:
                                $scope.msgError = "No se ha podido añadir la competitición, el ID introducido ya existe. (409)";
                                break;
                        }
                        $scope.showAlertError = true;
                        $scope.showAlertErrorNone = false;
                        console.log("Add new competition response ERROR: " + response.status + " " +
                            response.data);
                    });
                    $scope.newCompetition.id = "";
                    $scope.newCompetition.year = "";
                    $scope.newCompetition.month = "";
                    $scope.newCompetition.day = "";
                    $scope.newCompetition.name = "";
                    $scope.newCompetition.sportcenter = "";
                    $scope.newCompetition.schoolcenter = "";
                    $scope.newCompetition.activity = "";
                    $scope.newCompetition.lengthactivity = "";
                    $scope.newCompetition.totaldistance = "";
                    $scope.newCompetition.inscriptionprice = "";
                    delete $scope.newCompetition;
                } else {
                    $scope.msgWarning = "Error en los campos, comprueba que son correctos.";
                    $scope.showAlertWarning = true;
                    $scope.showAlertWarningNone = false;
                    console.log("Add new competition; ERROR; Can't add a void Competition.")
                }
            } else {
                $scope.msgInfo = "Faltan campos por completar, NO se puede añadir una competición vacía.";
                $scope.showAlertInfo = true;
                $scope.showAlertInfoNone = false;
                console.log("Add new competition; ERROR; Fields missings.")
            }
        }

        $scope.delCompetition = function (id) {
            clearAlerts();
            console.log("Deleting competition " + id);
            $http.delete(API + "/" + id).then(function (response) {
                console.log("DELETE response " + response.status + " " +
                    response.data);
            });
            refresh(undefined, undefined);
        }

        $scope.delAllCompetition = function () {
            clearAlerts();
            console.log("Deleting competitions from <" + API + ">");
            $http.delete(API).then(function (response) {
                console.log("Successfully delete all competitions: Code " + response.status + ", " + response.statusText);
                refresh(undefined, undefined);
            }, function (response) {
                console.log("Error in delete all competitions: Code " + response.status + ", " + response.statusText);
                $scope.msgError = "No se ha podido eliminar la competitición";
                $scope.showError = true;
            });
        }

    });