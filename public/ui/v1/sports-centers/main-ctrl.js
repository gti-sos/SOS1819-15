var app = angular.module("SportsCentersApp");
app.controller("MainCtrl", ["$scope", "$http", function ($scope, $http) {
    console.log("Retrieving $scope");

    var API = "/api/v2/sports-centers";
    refresh(undefined, undefined);
    $scope.limit = 10;
    $scope.offset = 0;
    $scope.showInfoComp = false;

    function refresh(limit, offset) {
        $scope.showInfoComp = false;
        console.log("Requesting competitions to <" + API + "?fromYear=" + $scope.fromYear + "&toYear=" + $scope.toYear + ">");
        let url = API +
            "?fromYear=" + parseInt($scope.fromYear) +
            "&toYear=" + parseInt($scope.toYear) +
            "&limit=" + parseInt(limit) +
            "&offset=" + parseInt($scope.offset);
        console.log(url);
        $http.get(url).then(function (response) {
            console.log("Data received: " + JSON.stringify(response.data, null, 2));
            $scope.sportsCenters = response.data;
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
        console.log("Paginating sports centers");
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

    $scope.addSportCenters = function () {
        $scope.showWarning = false;
        $scope.showSuccess = false;
        $scope.showInfo = false;
        $scope.showError = false;
        var newsportsCenters = $scope.newsportsCenters;

        console.log("Adding a new sport center. " + JSON.stringify(newsportsCenters));
        if (typeof (newsportsCenters) !== "undefined") {
            if (!isNaN(newsportsCenters.id)
                && isNaN(newsportsCenters.street)
                && isNaN(newsportsCenters.name)
                && !isNaN(newsportsCenters.postalcode)
                && typeof newsportsCenters.startingyear !== 'undefined'
                && !isNaN(newsportsCenters.surface)
                && isNaN(newsportsCenters.activity)
                && isNaN(newsportsCenters.paviment)
                && isNaN(newsportsCenters.sportfields)) {

                $http.post(API, JSON.stringify(newsportsCenters)).then(function (response) {
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
                $scope.newsportsCenters.id = "";
                $scope.newsportsCenters.street = "";
                $scope.newsportsCenters.name = "";
                $scope.newsportsCenters.postalcode = "";
                $scope.newsportsCenters.startingyear = "";
                $scope.newsportsCenters.surface = "";
                $scope.newsportsCenters.activity = "";
                $scope.newsportsCenters.paviment = "";
                $scope.newsportsCenters.sportfields = "";
                delete $scope.newsportsCenters;
            } else {
                $scope.showWarning = true;
                console.log("Añadido nuevo centro deportivo; ERROR; No se puede añadir un centro deportivo vacio.")
            }
        } else {
            $scope.showInfo = true;
            console.log("Añadido nuevo centro deportivo; ERROR; Faltan Campos.")
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
    


    $scope.delSportCenter = function (id) {
        console.log("Deleting sportcenter " + id);
        $http.delete(API + "/" + id).then(function (response) {
            console.log("DELETE response " + response.status + " " +
                response.data);
        });
        refresh(undefined, undefined);
    }

    $scope.delAllSportsCenters = function () {
        console.log("Deleting centers from <" + API + ">");
        $http.delete(API).then(function (response) {
            console.log("Se han eliminado todos los centros deportivos correctamente: Code " + response.status + ", " + response.statusText);
            refresh(undefined, undefined);
        }, function (response) {
            console.log("Se ha producido un ERROR al eliminar los centros deportivos: Code " + response.status + ", " + response.statusText);
        });
    }

    $scope.showEdit =  function(id,street,name,postalcode,startingyear,surface,activity,paviment,sportfields){
        $scope.editSportsCenters.id = parseInt(id);
        $scope.editSportsCentersStreet = street;
        $scope.editSportsCentersName = name;
        $scope.editSportsCenters.postalcode = parseInt(postalcode);
        $scope.editSportsCenters.startingyear = parseInt(startingyear);
        $scope.editSportsCentersSurface = surface;
        $scope.editSportsCentersActivity = activity;
        $scope.editSportsCentersPaviment = paviment;
        $scope.editSportsCenters.sportfields = parseInt(sportfields);

    }

    $scope.editSportsCenters =  function(id,street,name,postalcode,startingyear,surface,activity,paviment,sportfields) {
        if (!isNaN(id)
            && isNaN(street)
            && isNaN(name)
            && !isNaN(postalcode)
            && typeof startingyear !== 'undefined'
            && isNaN(surface)
            && isNaN(activity)
            && isNaN(paviment)
            && !isNaN(sportfields)){
                
            var data = {
                id: parseInt(id),
                street: street,
                name: name,
                postalcode: parseInt(postalcode),
                startingyear: parseInt(startingyear),
                surface: surface,
                activity: activity,
                paviment: paviment,
                sportfield: parseInt(sportfields)
            };
            console.log("Enviando actualizacion de centro deportivo  de <" + API + id + ">");
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
