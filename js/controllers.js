'use strict';

/* Coach Controllers */

var coach = angular.module('coach', []);


coach.controller('coachProfile', function($scope, $http) {
  $http.get('coach.json').success(function(data) {
    $scope.coach = data;
  }); 
  $scope.submit = function(){
    //send $scope.coach somewhere!
   }
});
