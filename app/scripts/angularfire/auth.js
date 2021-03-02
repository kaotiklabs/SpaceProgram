'use strict';

angular.module('firebase.Auth', [])

  

    .constant('SIMPLE_LOGIN_PROVIDERS', ['password','anonymous','facebook','google','twitter'])

  .constant('loginRedirectPath', '/login')


  .factory('auth', ["$firebaseAuth", function ($firebaseAuth) {
      return $firebaseAuth();
    }]);
