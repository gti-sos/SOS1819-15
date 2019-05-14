angular
    .module("SOS1819-15App", ["ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "./index.html"
            })
            .when("/sportsCompetitions", {
                templateUrl: "ui/v1/sports-competitions"
            });
    });
console.log("SOS1819-15App initialized!");