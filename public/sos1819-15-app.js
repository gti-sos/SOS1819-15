angular
    .module("SOS1819-15App", ["ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "./index.html"
            })
            .when("/ui/v1/sports-competitions", {
                templateUrl: "ui/v1/sports-competitions"
            })
            .when("/ui/v1/sports-centers", {
                templateUrl: "ui/v1/sports-centers"
            });
    });
console.log("SOS1819-15App initialized!");