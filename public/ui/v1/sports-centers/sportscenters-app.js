

angular
    .module("SOS1819-15App",["ngRoute"])
    .config(function ($routeProvider){
        $routeProvider.
            when("/",{
                controller: "ListCtrl" ,
                templateUrl: "list/list.html",
                resolve: {
                    autoLoad: function ($http) {
                        return $http.get("/api/v1/sports-centers?offset=0&limit=10").then(function (response) {
                            console.log(response.data);
                            return response.data;
                        }, function (response) {
                            $scope.dataResponse = response.status + ", " + response.statusText
                        });
                    }
                }
            })
            .when("/edit",{
                controller : "EditCtrl",
                templateUrl: "edit/edit.html"
            })
            ;
    }); // Mismo nombre que definimos en ng-app
    console.log("App initialized!");