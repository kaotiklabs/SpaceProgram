'use strict';

/**
 * @ngdoc overview
 * @name spaceProgramApp
 * @description
 * # spaceProgramApp
 *
 * Main module of the application.
 */

 var underscore = angular.module('underscore', []);
 underscore.factory('_', ['$window', function($window) {
   return $window._; // assumes underscore has already been loaded on the page
 }]);

angular.module('spaceProgramApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'firebase.utils',
    'firebase.Auth',
    'chart.js',
    'ngLetterAvatar',
    'angularInlineEdit',
    'ui.knob',
    angularDragula(angular)
  ]);
