var app = angular.module("UIEducationsCentersApp");
app.controller("MainCtrl", ["$scope", "$http", function ($scope, $http) {
    console.log("Retrieving $scope");

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
    }

    refresh();

    function refresh(){
        $http.get($scope.url + "?limit=10&offset=" + $scope.offset).then(function (response) {
            let res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            console.log(response.data);
            getNumPag(response.data.length);
            $scope.educations = response.data;
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
            let res = JSON.stringify(response.data, null, 2);
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

    $http.get($scope.url + "?offset=10&limit=10").then(function (response) {
        let res = JSON.stringify(response.data, null, 2);
        if (response.data.length === 0) {

        }
        console.log(response.data);
        $scope.educations = response.data;
        $scope.code = response.status;
    }, function (response) {
        $scope.dataResponse = response.status + ", " + response.statusText
    });

    $scope.sendGetForEdit = function (id_edit) {
        $http.get($scope.url + "/" + id_edit).then(function (response) {
            let res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            console.log(response.data);
            $scope.id_edit = response.data.id;
            $scope.country_edit = response.data.country;
            $scope.center_edit = response.data.center;
            $scope.name_edit = response.data.name;
            $scope.ownership_edit = response.data.ownership;
            $scope.domicile_edit = response.data.domicile;
            $scope.locality_edit = response.data.locality;
            $scope.phone_edit = response.data.phone;
            $scope.lat_edit = response.data.lat;
            $scope.lon_edit = response.data.lon;
            $scope.sports_education_edit = response.data.sports_education;
            $scope.monthStart_edit = response.data.monthStart;
            $scope.dataResponse = res;
            $scope.code = response.status;
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
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

    $scope.sendGetNew = function () {
        $http.get($scope.url).then(function (response) {
            let res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            console.log(response.data);
            $scope.educations = response.data;
            $scope.code = response.status;
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    };

    // POST sobre el conjunto

    $scope.sendPost = function (id, country, center, name, ownership, domicile, locality, phone, lat, lon, sports_education, monthStart) {
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
            && typeof monthStart !== 'undefined') {

            let data = {
                id: parseInt(id),
                country: country,
                center: center,
                name: name,
                ownership: ownership,
                domicile: domicile,
                locality: locality,
                phone: parseInt(phone),
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                sports_education: parseInt(sports_education),
                monthStart: parseInt(monthStart)
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

    // PUT sobre recurso concreto

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
            let res = JSON.stringify(response.data, null, 2);
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
            let res = JSON.stringify(response.data, null, 2);
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