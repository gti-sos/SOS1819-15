var app = angular.module("MiniPostmanAppCompetitionsApp");
app.controller("MainCtrl", ["$scope", "$http", function ($scope, $http) {
    console.log("Retrieving $scope");

    var API = "/api/v1/sports-competitions/";

    console.log("Requesting contacts to <" + API + ">");
    refresh();

    function refresh() {
        $http.get(API).then(function (response) {
            console.log("Data received: " + JSON.stringify(response.data, null, 2));
            $scope.competitions = response.data;
        });
    }

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

    function post(id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice, additionalinfo) {
        if (typeof id !== 'undefined'
            && typeof year !== 'undefined'
            && typeof day !== 'undefined'
            && typeof month !== 'undefined'
            && typeof name !== 'undefined'
            && typeof activity !== 'undefined'
            && typeof lengthactivity !== 'undefined'
            && typeof totaldistance !== 'undefined'
            && typeof inscriptionprice !== 'undefined') {

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
                additionalinfo: additionalinfo
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

    function put(id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice, additionalinfo) {
        if (typeof id !== 'undefined'
            && typeof year !== 'undefined'
            && typeof day !== 'undefined'
            && typeof month !== 'undefined'
            && typeof activity !== 'undefined'
            && typeof lengthactivity !== 'undefined'
            && typeof totaldistance !== 'undefined'
            && typeof inscriptionprice !== 'undefined') {
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
                additionalinfo: additionalinfo
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

    $scope.search = function () {
        switch (parseInt($scope.sel)) {
            case 1:
                console.log("Searching by ID");
                get();
                break;
            case 2:
                console.log("Searching by Name");
                post(id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice, additionalinfo);
                break;
            case 3:
                console.log("Searching by Year");
                put(id, year, day, month, name, sportcenter, schoolcenter, activity, lengthactivity, totaldistance, inscriptionprice, additionalinfo);
                break;
            case 4:
                console.log("Searching by Month");
                del();
                break;
        }
    }

    $scope.addCompetition = function () {
        var newCompetition = $scope.newCompetition;
        console.log("Adding a new competition. " + JSON.stringify(newCompetition));
        if (typeof (newCompetition) !== "undefined") {
            $http.post(API, JSON.stringify(newCompetition)).then(function (response) {
                console.log("POST response " + response.status + " " +
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
            $scope.newCompetition.additionalinfo = "";
            
        } else {
            console.log("Can't add a void Competition.")
            
        }
        refresh();
    }

    $scope.delCompetition = function (id) {
        console.log("Deleting competition " + id);
        $http.delete(API + id).then(function (response) {
            console.log("DELETE response " + response.status + " " +
                response.data);
        });
        refresh();
    }

}]);
