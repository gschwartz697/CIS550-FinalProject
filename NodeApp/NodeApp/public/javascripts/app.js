var app = angular.module('angularjsNodejsTutorial',[]);
app.controller('myController', function($scope, $http) {
        console.log('method');
        $scope.message="";
        $scope.Submit = function() {
            console.log('method');
            var request = $http.get('/pickup');
            request.success(function(data) {
                $scope.data = data;
            });
            request.error(function(data){
                console.log('err');
        });
    
    }; 
});
