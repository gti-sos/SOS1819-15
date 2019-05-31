var app = angular.module("MiniPostmanAppCompetitionsApp");
app.controller("MainCtrl", ["$scope", "$http", function ($scope, $http) {
    console.log("Retrieving $scope");

    $scope.url = "/api/v1/sports-competitions/";

    function get() {
        $http.get($scope.url).then(function (response) {
            var res = JSON.stringify(response.data, null, 2);
            console.log("GET: " + parseInt(response.data.length));
            if (parseInt(response.data.length) === 0) {
                $scope.dataResponse = res;
            } else {
                $scope.dataResponse = res;
            }
            $scope.code = "Code: " + response.status + "\n" + response.statusText;
        }, function (response) {
            $scope.dataResponse = response.status + ", " + response.statusText
            $scope.code = response.status + ", " + response.statusText;
        });
    }

    function post(id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice, additionalinfo, latitude, longitude) {
        if (typeof id !== 'undefined'
            && typeof year !== 'undefined'
            && typeof day !== 'undefined'
            && typeof month !== 'undefined'
            && typeof name !== 'undefined'
            && typeof activity !== 'undefined'
            && typeof lengthactivity !== 'undefined'
            && typeof totaldistance !== 'undefined'
            && typeof inscriptionprice !== 'undefined'
            && typeof latitude !== 'undefined'
            && typeof longitude !== 'undefined') {

            if (typeof sportcenter === 'undefined') sportcenter = "";
            if (typeof schoolcenter === 'undefined') schoolcenter = "";
            if (typeof additionalinfo === 'undefined') additionalinfo = "";

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
                inscriptionprice: parseInt(inscriptionprice),
                additionalinfo: additionalinfo,
                latitude: latitude,
                longitude: longitude
            };
            console.log($scope.url);
            console.log(data);
            $http.post($scope.url, JSON.stringify(data)).then(function (response) {
                console.log("OK put method");
                $scope.dataResponse = JSON.stringify(response.data, null, 2);
                $scope.code = response.status + ", " + response.statusText;
            }, function (response) {
                console.log("Error PUT method: Code " + response.status + ", " + response.statusText);
                $scope.dataResponse = "Code: " + response.status + "\n" + response.statusText;
                $scope.code = response.status + ", " + response.statusText;
            });
        } else {
            $scope.code = "";
            $scope.dataResponse = "Fields required";
        }
    }

    function put(id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice, additionalinfo, latitude, longitude) {
        if (typeof id !== 'undefined'
            && typeof year !== 'undefined'
            && typeof day !== 'undefined'
            && typeof month !== 'undefined'
            && typeof activity !== 'undefined'
            && typeof lengthactivity !== 'undefined'
            && typeof totaldistance !== 'undefined'
            && typeof inscriptionprice !== 'undefined'
            && typeof latitude !== 'undefined'
            && typeof longitude !== 'undefined') {
            if (typeof name === 'undefined') name = "";
            if (typeof sportcenter === 'undefined') sportcenter = "";
            if (typeof schoolcenter === 'undefined') schoolcenter = "";
            if (typeof activity === 'undefined') activity = "";
            if (typeof additionalinfo === 'undefined') additionalinfo = "";

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
                inscriptionprice: parseInt(inscriptionprice),
                additionalinfo: additionalinfo,
                latitude: latitude,
                longitude: longitude
            };
            console.log($scope.url);
            console.log(data);
            $http.put($scope.url, JSON.stringify(data)).then(function (response) {
                console.log("OK put method");
                $scope.dataResponse = JSON.stringify(response.data, null, 2);
                $scope.code = response.status + ", " + response.statusText;
            }, function (response) {
                console.log("Error PUT method: Code " + response.status + ", " + response.statusText);
                $scope.dataResponse = "Code: " + response.status + "\n" + response.statusText;
            });
        } else {
            $scope.code = "";
            $scope.dataResponse = "Fields required";
        }
    }

    function del() {
        $http.delete($scope.url).then(function (response) {
            console.log($scope.url);
            var res = JSON.stringify(response.data, null, 2);
            if (response.data.length == 1) {

            }
            $scope.code = response.status + ", " + response.statusText;
            $scope.dataResponse = response.status + ", " + response.statusText;
        }, function (response) {
            $scope.code = response.status + ", " + response.statusText;
            $scope.dataResponse = response.status + ", " + response.statusText
        });
    }

    $scope.sendAction = function (id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice, additionalinfo,latitude, longitude) {
        switch (parseInt($scope.sel)) {
            case 1:
                console.log("GET petition");
                get();
                break;
            case 2:
                console.log("POST petition");
                post(id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice, additionalinfo,latitude, longitude);
                break;
            case 3:
                console.log("PUT petition");
                put(id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice, additionalinfo,latitude, longitude);
                break;
            case 4:
                console.log("DELETE petition");
                del();
                break;
        }
    }

}]);