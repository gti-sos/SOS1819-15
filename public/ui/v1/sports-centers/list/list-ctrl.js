angular
    .module("SOS1819-15App")
    .controller("ListCtrlsportsCenters", ["$scope", "$http", function ($scope, $http) {
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

    // POST sobre el conjunto

    $scope.sendPost = function(id,street,name,postalcode,startingyear,surface,activity,paviment,sportfields){
        if(typeof id!=='undefined'
        && typeof street!=='undefined'
        && typeof name!=='undefined'
        && typeof postalcode!=='undefined'
        && typeof startingyear!=='undefined'
        && typeof surface!=='undefined'
        && typeof activity!=='undefined'
        && typeof paviment!=='undefined'
        && typeof sportfields!=='undefined'){

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
            $http.post($scope.url, JSON.stringify(data)).then(function (response) {
                console.log("OK put method");
                $scope.dataResponse =  JSON.stringify( response.statusCode + " : " + response.data, null, 2);
                $scope.code = response.status;
                $scope.success = true;
                $scope.showError= false;
                $scope.successMsg = "Creado correctamente";
                refresh();
            }, function (response) {
                console.log("Error PUT method: Code " + response.status + ", " + response.statusText);
                $scope.dataResponse = "Code: " + response.status + "\n" + response.statusText;
                $scope.success = false;
                $scope.showError= true;
                if(response.status === 409){
                    $scope.errorMsg = "Ya existe un recurso con id = " + id;
                }
            });

        }
    };

}]);