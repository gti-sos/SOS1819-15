var app = angular.module("UIEducationsCentersApp");
app.controller("MainCtrl", ["$scope", "$http","$routeParams", "$location", function ($scope,$http,$routeParams,$location) {
    console.log("Retrieving $scope");

    let id_route = $routeParams.id;
    $scope.isaList = true;

    $scope.url = "/api/v1/educations-centers";
    $scope.success = false;
    $scope.showError= false;
    $scope.numPaginas = 1;
    $scope.pagActual = 2;
    $scope.offset = 0;
    $scope.limit = 10;
    $scope.errorMsg = "";
    $scope.successMsg = "Cargado Correctamente";
    $scope.getNumber = function(num) {
        return new Array(num);
    };


    function getNumPag(numItems){
        $scope.numPaginas = Math.ceil(numItems/10);
    }

    $scope.plusOffset = function (num){
        $scope.offset = (num-1) * 10;
        $scope.success = false;
        $scope.showError= false;
        refresh();
    };


    $scope.sendSearchOwnership = function (ownershipSearch) {
        let query = "";
        if(ownershipSearch !== undefined && ownershipSearch !== ""){
            query = "?ownership=" + ownershipSearch;
        }
        $http.get($scope.url + query).then(function (response) {
            let res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            console.log(response.data);
            $scope.educations = response.data;
            $scope.code = response.status;
            $scope.success = true;
            $scope.showError= false;
            $scope.successMsg = "Mostrando los centros con titularidad: " + ownershipSearch;
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    };


    $scope.sendPut = function (id, country, center, name, ownership, domicile, locality, phone, lat, lon, sports_education, monthStart) {
        if (typeof id !== 'undefined'
            && typeof country !== 'undefined'
            && typeof center !== 'undefined'
            && typeof name !== 'undefined'
            && typeof ownership !== 'undefined'
            && typeof domicile !== 'undefined'
            && typeof locality !== 'undefined'
            && typeof phone !== 'undefined'
            && typeof lat !== 'undefined'
            && typeof lon !== 'undefined'
            && typeof sports_education !== 'undefined'
            && typeof monthStart !== 'undefined') ;

        let data = {
            id: parseInt(id),
            country: country,
            center: center,
            name: name,
            ownership: ownership,
            domicile: domicile,
            locality: locality,
            phone: phone,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            sports_education: parseInt(sports_education),
            monthStart: parseInt(monthStart)
        };
        console.log($scope.url);
        console.log(data);
        $http.put($scope.url + "/" + id, JSON.stringify(data)).then(function (response) {
            console.log("OK put method");
            $scope.dataResponse = JSON.stringify(response.data, null, 2);
            $scope.code = response.status;
            $scope.success = true;
            $scope.showError= false;
            $scope.successMsg = "Modificado correctamente";
            $location.path("/");
        }, function (response) {
            console.log("Error PUT method: Code " + response.status + ", " + response.statusText);
            $scope.dataResponse = "Code: " + response.status + "\n" + response.statusText;

        });

    };

}]);