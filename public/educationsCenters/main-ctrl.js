var app = angular.module("MiniPostmanAppEducationsCentersApp");
app.controller("MainCtrl", ["$scope", "$http", function ($scope, $http) {
    console.log("Retrieving $scope");

    $scope.url = "/api/v1/educations-centers/";

    $scope.sendGet = function () {
        $http.get($scope.url).then(function (response) {
            let res = JSON.stringify(response.data, null, 2);
            if (response.data.length === 0) {

            }
            $scope.dataResponse = res;
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
            }, function (response) {
                console.log("Error PUT method: Code " + response.status + ", " + response.statusText);
                $scope.dataResponse = "Code: " + response.status + "\n" + response.statusText;
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
        $http.put($scope.url, JSON.stringify(data)).then(function (response) {
            console.log("OK put method");
            $scope.dataResponse = JSON.stringify(response.data, null, 2);
            $scope.code = response.status;
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
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    }

}]);