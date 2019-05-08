var app = angular
    .module("UIEducationsCentersApp",["ngRoute"])
    .config(function ($routeProvider){
        $routeProvider.
            when("/",{
                controller: "ListCtrl" ,
                templateUrl: "list/list.html"
            })
            .when("/edit/:id",{
                controller : "EditCtrl",
                templateUrl: "edit/edit.html"
            })
            ;
    }); // Mismo nombre que definimos en ng-app
console.log("App initialized!");