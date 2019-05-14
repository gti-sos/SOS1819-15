angular.module("SOS1819-15App")
    .controller("EditCtrlsportsCenters", ["$scope", "$http", function ($scope, $http) {
    console.log("Retrieving $scope");

    $scope.url = "/api/v1/sports-centers";
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
    }

    refresh();

    function refresh(){
        $http.get($scope.url + "?limit=10&offset=" + $scope.offset).then(function (response) {
            var res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            console.log(response.data);
            getNumPag(response.data.length);
            $scope.sportscenters = response.data;
            $scope.code = response.status;
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    }

    function getNumPag(numItems){
        $scope.numPaginas = Math.ceil(numItems/10);
    }

    $scope.plusOffset = function (num){
        $scope.offset = (num-1) * 10;
        $scope.success = false;
        $scope.showError= false;
        refresh();
    };

    $scope.sendInitialData = function () {
        $http.get($scope.url + "/loadInitialData").then(function (response) {
            var res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            $scope.success = true;
            $scope.showError= false;
            $scope.successMsg = "Añadido todos los datos iniciales";
            refresh();
            $scope.dataResponse = res;
            $scope.code = response.status;
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText;
            $scope.success = false;
            $scope.showError = true;
            if(response.status === 409){
                $scope.errorMsg = "Ya hay datos cargados";
            }
        });
    };


    $scope.sendGetForEdit = function (id_edit) {
        $http.get($scope.url + "/" + id_edit).then(function (response) {
            var res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            console.log(response.data);
            $scope.id_edit = response.data.id;
            $scope.street_edit = response.data.street;
            $scope.name_edit = response.data.name;
            $scope.postalcode_edit = response.data.postalcode;
            $scope.startingyear_edit = response.data.startingyear;
            $scope.surface_edit = response.data.surface;
            $scope.activity_edit  = response.data.activity;
            $scope.paviment_edit = response.data.paviment;
            $scope.sportfields_edit = response.data.sportfields;
            $scope.code = response.status;
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    };

    $scope.sendSearchPostalcode = function (postalcodesearch) {
        var query = "";
        if(postalcodesearch !== undefined && postalcodesearch !== ""){
            query = "?postalcode=" + postalcodesearch;
        }
        $http.get($scope.url + query).then(function (response) {
            var res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            console.log(response.data);
            $scope.sportscenters = response.data;
            $scope.code = response.status;
            $scope.success = true;
            $scope.showError= false;
            $scope.successMsg = "Mostrando los centros con codigo postal: " + postalcode;
            
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    };

    $scope.sendGetNew = function () {
        $http.get($scope.url).then(function (response) {
            var res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            console.log(response.data);
            $scope.sportscenters = response.data;
            $scope.code = response.status;
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    };
    
    // PUT sobre recurso concreto

    $scope.sendPut = function(id,street,name,postalcode,startingyear,surface,activity,paviment,sportfields){
        if(typeof id!=='undefined'
        && typeof street!=='undefined'
        && typeof name!=='undefined'
        && typeof postalcode!=='undefined'
        && typeof startingyear!=='undefined'
        && typeof surface!=='undefined'
        && typeof activity!=='undefined'
        && typeof paviment!=='undefined'
        && typeof sportfields!=='undefined');

            var data = {
                id: parseInt(id),
                street:street,
                name:name,
                postalcode:parseInt(postalcode),
                startingyear:parseInt(startingyear),
                surface:parseInt(surface),
                activity:activity,
                paviment:paviment,
                sportfields:parseInt(sportfields)
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
            refresh();
        }, function (response) {
            console.log("Error PUT method: Code " + response.status + ", " + response.statusText);
            $scope.dataResponse = "Code: " + response.status + "\n" + response.statusText;

        });

    };

    // Elimina conjunto o recurso concreto

    $scope.sendDel = function () {
        $http.delete($scope.url).then(function (response) {
            console.log($scope.url);
            var res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 1) {

            }
            $scope.dataResponse = res;
            $scope.code = response.status;
            $scope.success = true;
            $scope.showError= false;
            $scope.successMsg = "Borrado todos los recursos";
            refresh();
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    };

    $scope.sendDelOne = function (id) {
        console.log("delOne");
        $http.delete($scope.url + "/" + id).then(function (response) {
            console.log($scope.url);
            var res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 1) {

            }
            refresh();
            $scope.dataResponse = res;
            $scope.code = response.status;
            $scope.success = true;
            $scope.showError= false;
            $scope.successMsg = "Borrado Correctamente";
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    };

}]);