'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */

angular.module('spaceProgramApp')
   .controller('AccountCtrl', ["$scope", "auth", "currentAuth", "MissionService", "CrewService",
  function (
    $scope,
    auth,
    currentAuth,
    MissionService,
    CrewService,
    $timeout
  ) {

  $scope.knobOptions = {
    size:156,
    displayPrevious: true,
    unit: "%",
    readOnly: true,
    subText: {
      enabled: true,
      text: 'Score',
      font: 'auto'
    },
    trackWidth: 30,
    barWidth: 20,
    trackColor: 'rgba(0,189,156,.2)',
    barColor: 'rgba(0,189,156,1)',
    textColor: 'rgba(43,62,81,1)'
  };

  $scope.user = {
    uid: currentAuth.uid,
    name: currentAuth.displayName,
    photo: currentAuth.photoURL,
    email: currentAuth.email
  };

  $scope.authInfo = currentAuth;
  $scope.numMissions = "-";
  $scope.numCrews = "-";
  $scope.numMembers = "-";
  $scope.medianCrews = 0;

  init();

  function init(){

    // load data service if has not been loaded before
    if (MissionService.userMissions == null){
      MissionService.init(currentAuth.uid).then(function(){
        $scope.numMissions = MissionService.getNumberMissions();
        $scope.missions = MissionService.userMissions;
      });
    }else{
      $scope.numMissions = MissionService.getNumberMissions();
      $scope.missions = MissionService.userMissions;
    };

    if (CrewService.userCrews == null){
      CrewService.init(currentAuth.uid).then(function(){
        $scope.numCrews = CrewService.getNumberCrews();
        $scope.numMembers = CrewService.getNumberMembers();
        $scope.crews = CrewService.userCrews;
        $scope.medianCrews = CrewService.getMedianScoreAllCrews();
      });
    }else{
      $scope.numCrews = CrewService.getNumberCrews();
      $scope.numMembers = CrewService.getNumberMembers();
      $scope.crews = CrewService.userCrews;
      $scope.medianCrews = CrewService.getMedianScoreAllCrews();
    };

  };

  $scope.changePassword = function(oldPass, newPass, confirm) {
    $scope.err = null;

    if( !oldPass || !newPass ) {
      error('Please enter all fields');

    } else if( newPass !== confirm ) {
      error('Passwords do not match');

    } else {
      // New Method
      auth.$updatePassword(newPass).then(function() {
        console.log('Password changed');
      }, error);

    }
  };

  $scope.changeEmail = function (newEmail) {
    auth.$updateEmail(newEmail)
      .then(function () {
        console.log("email changed successfully");
      })
      .catch(function (error) {
        console.log("Error: ", error);
      })
  };

  $scope.logout = function() {
    auth.$signOut();
  };

  function error(err) {
    console.log("Error: ", err);
  }

  function success(msg) {
    alert(msg, 'success');
  }

  function alert(msg, type) {
    var obj = {text: msg+'', type: type};
    $scope.messages.unshift(obj);
    $timeout(function() {
      $scope.messages.splice($scope.messages.indexOf(obj), 1);
    }, 10000);
  }

  $scope.updateProfile = function(name, imgUrl) {
    firebase.auth().currentUser.updateProfile({
      displayName: name,
      photoURL: imgUrl
    })
    .then(function () {
      console.log("updated");
    })
    .catch(function (error) {
      console.log("error ", error);
    })
  };

}]);
