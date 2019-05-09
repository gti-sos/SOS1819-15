angular
    .module("UIEducationsCentersApp",["ngRoute"])
    .config(function ($routeProvider){
        $routeProvider.
            when("/",{
                controller: "ListCtrl" ,
                templateUrl: "list/list.html",
                resolve: {
                    autoLoad: function ($http) {
                        return $http.get("/api/v1/educations-centers?offset=0&limit=10").then(function (response) {
                            console.log(response.data);
                            return response.data;
                        }, function (response) {
                            $scope.dataResponse = response.status + ", " + response.statusText
                        });
                    }
                }
            })
            .when("/edit/:id",{
                controller : "EditCtrl",
                templateUrl: "edit/edit.html"
            })
            ;
    }); // Mismo nombre que definimos en ng-app
    console.log("App initialized!");