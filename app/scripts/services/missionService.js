'use strict';

/**
* @ngdoc service
* @name loreAcademyApp.Trivia
* @description
* # Trivia
* Service in the loreAcademyApp.
*/

angular.module('spaceProgramApp')
.service('MissionService', function (fbutil, $location) {

  var self = this;
  var userMissions;


  self.init = function(uid){

    // console.log("init mission service");

    self.userMissions = [];
    self.userMissions = fbutil.syncObject('missions/' + uid);

    return self.userMissions.$loaded();
  };


  self.launchMission = function(uid, crewid, missionid) {

    console.log("Service Launch Mission id: "+missionid);

    // Generate random 6 digit pincode for the game
    var gameid = _.random(100000,999999);

    // Connect to Firebase
    var game = fbutil.syncObject('games/' + gameid);

    // Upon connection build game object
    game.$loaded().then(function() {
      game.data = {
        'uid'  : uid,
        'crewid'  : crewid,
        'missionid'  : missionid,
        'state'  : 'waitingForPlayers'
      };
      game.questions = self.userMissions[missionid].questions;

      return game.$save();
    })
    .then(function() {
      // after save is completed take us to Host view
      $location.path('/host/' + gameid);
    })
  };


  self.getNumberMissions = function (){

    var num = 0;

    angular.forEach(self.userMissions, function(value, key) {
      num++;
    });

    return num;
  };

});
