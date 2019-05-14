angular
    .module("SOS1819-15App", ["ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "./index.html"
            })
            .when("/ui/v1/sports-competitions/", {
                controller: "ListCtrlSportsCompetitions" ,
                templateUrl: "ui/v1/sports-competitions/list/list.html"
            })
            .when("/ui/v1/sports-competitions/edit/:id", {
                controller : "EditCtrlSportsCompetitions" ,
                templateUrl: "ui/v1/sports-competitions/edit/edit.html"
            })
            .when("/ui/v1/sports-centers/", {
                controller: "ListCtrlsportsCenters" ,
                templateUrl: "ui/v1/sports-centers/list/list.html"
            })
            .when("/ui/v1/sports-centers/edit/", {
                controller : "EditCtrlsportsCenters" ,
                templateUrl: "ui/v1/sports-centers/edit/edit.html"
            })
            .when("/ui/v1/educations-centers/", {
                controller: "ListCtrlEducations" ,
                templateUrl: "ui/v1/educations-centers/list/list.html"
            })
            .when("/ui/v1/educations-centers/edit/:id", {
                controller : "EditCtrlEducations" ,
                templateUrl: "ui/v1/educations-centers/edit/edit.html"
            })
            ;
    });
console.log("SOS1819-15App initialized!");