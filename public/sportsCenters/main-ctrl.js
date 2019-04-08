var app = angular.module("MiniPostmanAppSportsCentersApp");
app.controller("MainCtrl",["$scope","$http",function($scope,$http){ 
    console.log("Retrieving $scope");

    var path="https://sos1819-15.herokuapp.com";
    $scope.url="/api/v1/sports-centers/";

    $scope.sendGet = function(){
        $http.get(path+$scope.url).then(function(response){
            var res = JSON.stringify(response.data,null,2);
            if (response.data.length == 0){
                
            }
            $scope.dataResponse = res;
        }, function (response) {
            $scope.dataResponse=response.status+", "+response.statusText
        });
    }

    $scope.sendPost = function(id,street,name,postalcode,startingyear,surface,activity,paviment,sportfields){
        if(typeof id!=='undefined'
        && typeof street!=='undefined'
        && typeof name!=='undefined'
        && typeof postalcode!=='undefined'
        && typeof startingyear!=='undefined'
        && typeof surface!=='undefined'
        && typeof activity!=='undefined'
        && typeof paviment!=='undefined'
        && typeof sportfields!=='undefined');

            var data = {
                id: parseInt(id),
                street:street,
                name:name,
                postalcode:parseInt(postalcode),
                startingyear:parseInt(startingyear),
                surface:parseInt(surface),
                activity:activity,
                paviment:paviment,
                sportcenter:parseInt(sportfields)
            };
            console.log($scope.url);
            console.log(data);
            $http.post(path+$scope.url, JSON.stringify(data)).then(function (response) {
                console.log("OK put method");
                $scope.dataResponse = JSON.stringify(response.data,null,2);
            }, function (response) {
                console.log("Error PUT method: Code "+response.status+", "+response.statusText);
                $scope.dataResponse="Code: "+response.status+"\n"+response.statusText;
            });
        
    }

    $scope.sendPut = function(id,street,name,postalcode,startingyear,surface,activity,paviment,sportfields){
        if(typeof id!=='undefined'
        && typeof street!=='undefined'
        && typeof name!=='undefined'
        && typeof postalcode!=='undefined'
        && typeof startingyear!=='undefined'
        && typeof surface!=='undefined'
        && typeof activity!=='undefined'
        && typeof paviment!=='undefined'
        && typeof sportfields!=='undefined');

            var data = {
                id: parseInt(id),
                street:street,
                name:name,
                postalcode:parseInt(postalcode),
                startingyear:parseInt(startingyear),
                surface:surface,
                activity:activity,
                paviment:paviment,
                sportcenter:parseInt(sportfields)
            };
            console.log($scope.url);
            console.log(data);
            $http.put(path+$scope.url, JSON.stringify(data)).then(function (response) {
                console.log("OK put method");
                $scope.dataResponse = JSON.stringify(response.data,null,2);
            }, function (response) {
                console.log("Error PUT method: Code "+response.status+", "+response.statusText);
                $scope.dataResponse="Code: "+response.status+"\n"+response.statusText;
            });
     
    }

    $scope.sendDel = function(){
        $http.delete(path+$scope.url).then(function(response){
            console.log($scope.url);
            var res = JSON.stringify(response.data,null,2);
            if (response.data.length == 1){
                
            }
            $scope.dataResponse = res;
        }, function (response) {
            $scope.dataResponse=response.status+", "+response.statusText
        });
    }

}]);
// Modulo 1, modulo que usaremos,
// El último parámetro es el CALLBACK.