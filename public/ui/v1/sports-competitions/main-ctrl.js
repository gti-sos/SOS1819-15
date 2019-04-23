var app = angular.module("SportsCentersAPP");
app.controller("MainCtrl", ["$scope", "$http", function ($scope, $http) {
    console.log("Retrieving $scope");

    var API = "/api/v2/sports-centers";
    refresh(undefined, undefined);
    $scope.limit = 10;
    $scope.offset = 0;
    $scope.showInfoComp = false;

    function refresh(limit, offset) {
        $scope.showInfoComp = false;
        console.log("Requesting competitions to <" + API + "?fromMonth=" + $scope.fromMonth + "&toMonth=" + $scope.toMonth + ">");
        let url = API +
            "?fromMonth=" + parseInt($scope.fromMonth) +
            "&toMonth=" + parseInt($scope.toMonth) +
            "&limit=" + parseInt(limit) +
            "&offset=" + parseInt($scope.offset);
        console.log(url);
        $http.get(url).then(function (response) {
            console.log("Data received: " + JSON.stringify(response.data, null, 2));
            $scope.competitions = response.data;
            if (JSON.stringify(response.data, null, 2).length===2){
                $scope.showInfoComp = true;
            }
        },function(response){
            console.log("Data received: " + JSON.stringify(response.data, null, 2));
        });
    }

    $scope.search = function () {
        refresh(undefined, undefined);
    }

    $scope.pagination = function (page) {
        console.log("Paginating sports competitions");
        if (isNaN(page)) {
            if (page.localeCompare("x")==0) {
                refresh($scope.limit, $scope.offset);
                $scope.offset += 1;
            } else if (page.localeCompare("z")==0) {
                if ($scope.offset > 0) {
                    $scope.offset -= 1;
                }
                refresh($scope.limit, $scope.offset);
            } else {
                $scope.offset = 0;
                refresh(0, $scope.offset);
            }
        } else {
            $scope.offset = page;
            refresh($scope.limit, $scope.offset);
        }
    }

    $scope.addCompetition = function () {
        $scope.showWarning = false;
        $scope.showSuccess = false;
        $scope.showInfo = false;
        $scope.showError = false;
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
                    $scope.showSuccess = true
                    refresh();
                }, function (response) {
                    switch (response.status){
                        case 409:
                        $scope.msgError="No se ha podido añadir la competitición, el ID introducido ya existe. (409)";
                        break;
                    }                    
                    $scope.showError = true;
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
                $scope.showWarning = true;
                console.log("Add new competition; ERROR; Can't add a void Competition.")
            }
        } else {
            $scope.showInfo = true;
            console.log("Add new competition; ERROR; Fields missings.")
        }
    }

    $scope.closeAlertA = function () {
        $scope.showSuccess = false;
    }
    $scope.closeAlertW = function () {
        $scope.showWarning = false;
    }
    $scope.closeAlertI = function () {
        $scope.showInfo = false;
    }
    $scope.closeAlertComp = function () {
        $scope.showInfoComp = false;
    }
    $scope.closeAlertError = function () {
        $scope.showError = false;
    }
    


    $scope.delCompetition = function (id) {
        console.log("Deleting competition " + id);
        $http.delete(API + "/" + id).then(function (response) {
            console.log("DELETE response " + response.status + " " +
                response.data);
        });
        refresh(undefined, undefined);
    }

    $scope.delAllCompetition = function () {
        console.log("Deleting competitions from <" + API + ">");
        $http.delete(API).then(function (response) {
            console.log("Successfully delete all competitions: Code " + response.status + ", " + response.statusText);
            refresh(undefined, undefined);
        }, function (response) {
            console.log("Error in delete all competitions: Code " + response.status + ", " + response.statusText);
        });
    }

    $scope.showEdit = function (id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice) {
        $scope.editCompetition.id = parseInt(id);
        $scope.editCompetition.year = parseInt(year);
        $scope.editCompetition.day = parseInt(day);
        $scope.editCompetition.month = parseInt(month);
        $scope.editCompetitionName = name;
        $scope.editCompetitionSportcenter = sportcenter;
        $scope.editCompetitionSchoolcenter = schoolcenter;
        $scope.editCompetitionActivity = activity;
        $scope.editCompetition.lengthactivity = parseInt(lengthactivity);
        $scope.editCompetition.totaldistance = parseInt(totaldistance);
        $scope.editCompetition.inscriptionprice = parseInt(inscriptionprice);
    }

    $scope.editCompetition = function (id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice) {
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
                refresh(undefined, undefined);
            }, function (response) {
                console.log("Error PUT method: Code " + response.status + ", " + response.statusText);
            });
        } else {
            console.log("Fields required");
        }
    }

}]);
