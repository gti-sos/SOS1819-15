angular
    .module("SportsCompetitionsApp", ["ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider.
            when("/", {
                controller: "ListCtrl",
                templateUrl: "list/list.html",
                resolve: {
                    autoLoad: function ($http) {
                        return $http.get("/api/v2/sports-competitions?offset=0&limit=10").then(function (response) {
                            console.log(response.data);
                            return response.data;
                        }, function (response) {
                            $scope.dataResponse = response.status + ", " + response.statusText
                        });
                    }
                }
            })
            .when("/edit/:id", {
                controller: "EditCtrl",
                templateUrl: "edit/edit.html"
            });
    });
console.log("App initialized!");