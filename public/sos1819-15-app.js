angular
    .module("SOS1819-15App", ["ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "./index.html"
            })
            .when("/integrations", {
                templateUrl: "ui/v1/integrations.html"
            })
            .when("/analytics", {
                controller: "AnalyticsCtrl" ,
                templateUrl: "ui/v1/analytics.html"
            })
            .when("/about", {
                templateUrl: "ui/v1/about.html"
            })
            .when("/ui/v1/sports-competitions/", {
                controller: "ListCtrlSportsCompetitions" ,
                templateUrl: "ui/v1/sports-competitions/list/list.html"
            })
            .when("/ui/v1/sports-competitions/edit/:id", {
                controller : "EditCtrlSportsCompetitions" ,
                templateUrl: "ui/v1/sports-competitions/edit/edit.html"
            })
            .when("/ui/v1/sports-competitions/analytics", {
                controller: "ChartsCtrlSportsCompetitions" ,
                templateUrl: "ui/v1/sports-competitions/charts/charts.html"
            })
            .when("/ui/v1/sports-competitions/integration", {
                controller: "IntegrationCtrlCompetitions" ,
                templateUrl: "ui/v1/sports-competitions/integration/integration.html"
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
            .when("/ui/v1/educations-centers/analytics", {
                controller: "ChartCtrlEducations" ,
                templateUrl: "ui/v1/educations-centers/chart/chart.html"
            })
            .when("/ui/v1/educations-centers/integration", {
                controller: "IntegrationCtrlEducations" ,
                templateUrl: "ui/v1/educations-centers/integration/integration.html"
            })
            ;
    });
console.log("SOS1819-15App initialized!");