'use strict';

/**
* @ngdoc service
* @name loreAcademyApp.Trivia
* @description
* # Trivia
* Service in the loreAcademyApp.
*/

angular.module('spaceProgramApp')
.service('CrewService', function (fbutil) {

  var self = this;
  var userCrews;


  self.init = function(uid){

    // console.log("init mission service");

    self.userCrews = [];
    self.userCrews = fbutil.syncObject('crews/' + uid);

    return self.userCrews.$loaded();
  };

  self.getMemberByPin = function (searchPin){

    var member = null;

    angular.forEach(self.userCrews, function(value, key) {
      if(self.userCrews[key].members != null){
        var members = self.userCrews[key].members;

        angular.forEach(members, function(value, key) {
          if(value.pin == searchPin){member = value;}
        });
      }
    });
    return member;
  };

  self.getMemberByCrewAndPin = function (crewId, searchPin){

    var member = null;
    if(self.userCrews[crewId] != null){
      if(self.userCrews[crewId].members != null){
        var members = self.userCrews[crewId].members;

        angular.forEach(members, function(value, key) {
          if(value.pin == searchPin){member = value;}
        });
      }
    }

    return member;
  };

  self.getNumberCrews = function (){
    var num = 0;

    angular.forEach(self.userCrews, function(value, key) {
      num++;
    });

    return num;
  };

  self.getMedianScoreAllCrews = function (){
    var median = 0;
    var num = 0;
    var totalScore = 0;

    angular.forEach(self.userCrews, function(value, key) {
      totalScore+= value.score;
      num++;
    });

    median = Math.floor(totalScore/num);
    return median;
  };

  self.getNumberMembers = function (){
    var num = 0;

    angular.forEach(self.userCrews, function(value, key) {
      if(self.userCrews[key].members != null){
        var crewMembers = self.userCrews[key].members.length;
        num = num + crewMembers;
      }
    });

    return num;
  };

});
