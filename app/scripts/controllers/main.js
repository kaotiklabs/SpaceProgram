'use strict';

/**
* @ngdoc function
* @name spaceProgramApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the spaceProgramApp
*/
angular.module('spaceProgramApp')
.controller('MainCtrl', ["$scope", "auth", "$location", "fbutil", function ($scope, auth, $location, fbutil) {

  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];

  $scope.logout = function () {
    auth.$signOut();
    console.log('logged out');
    $location.path('/');
    $scope.authData = null;
  };

}]);
