angular
    .module("SOS1819-15App")
    .controller("EditCtrlEducations", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function ($scope, $http, $routeParams, $location, $rootScope) {
        console.log("Retrieving $scope");

        var id_route = $routeParams.id;


        $scope.url = "/api/v2/educations-centers";
        $scope.success = false;
        $scope.showError = false;
        $scope.numPaginas = 1;
        $scope.pagActual = 2;
        $scope.offset = 0;
        $scope.limit = 10;
        $scope.errorMsg = "";
        $scope.successMsg = "Cargado Correctamente";
        $scope.getNumber = function (num) {
            return new Array(num);
        };

        sendGetForEdit();


        function getNumPag(numItems) {
            $scope.numPaginas = Math.ceil(numItems / 10);
        }

        $scope.plusOffset = function (num) {
            $scope.offset = (num - 1) * 10;
            $scope.success = false;
            $scope.showError = false;
            refresh();
        };


        function sendGetForEdit() {
            $http.get($scope.url + "/" + id_route).then(function (response) {
                var res = JSON.stringify(response.data, null, 2);
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
                $scope.sports_education_edit = response.data.sports_education + "";
                $scope.monthStart_edit = response.data.monthStart + "";
                $scope.yearStart_edit = response.data.yearStart + "";
                $scope.dataResponse = res;
                $scope.code = response.status;
            }, function (response) {
                $scope.dataResponse = response.status + ", " + response.statusText
            });
        };


        $scope.sendPut = function (id, country, center, name, ownership, domicile, locality, phone, lat, lon, sports_education, monthStart, yearStart) {
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
                && typeof yearStart !== 'undefined'
                && typeof monthStart !== 'undefined') ;

            var data = {
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
                monthStart: parseInt(monthStart),
                yearStart: parseInt(yearStart)
            };
            console.log($scope.url);
            console.log(data);
            $http.put($scope.url + "/" + id, JSON.stringify(data)).then(function (response) {
                console.log("OK put method");
                $scope.dataResponse = JSON.stringify(response.data, null, 2);
                $scope.code = response.status;
                $rootScope.success = true;
                $rootScope.showError = false;
                $rootScope.successMsg = "Modificado correctamente";
                $location.path("/ui/v1/educations-centers");
            }, function (response) {
                console.log("Error PUT method: Code " + response.status + ", " + response.statusText);
                $scope.dataResponse = "Code: " + response.status + "\n" + response.statusText;

            });

        };

    }]);