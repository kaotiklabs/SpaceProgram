'use strict';
/**
* @ngdoc function
* @name muck2App.controller:AccountCtrl
* @description
* # AccountCtrl
* Provides rudimentary account management functions.
*/
angular.module('spaceProgramApp')
.controller('MissionCtrl', ["$scope", "auth", "currentAuth", "fbutil", "$location", "MissionService", "CrewService",
function ($scope, auth, currentAuth, fbutil, $location, MissionService, CrewService) {

  $scope.user = {
    uid: currentAuth.uid,
    name: currentAuth.displayName,
    photo: currentAuth.photoURL,
    email: currentAuth.email
  };

  $scope.authInfo = currentAuth;


  $scope.editorMode = false;
  $scope.selectedMission;

  init();

  function init() {

    // load data service if has not been loaded before
    if (MissionService.userMissions == null){
      MissionService.init(currentAuth.uid);
    }
    $scope.missions = MissionService.userMissions;


    if (CrewService.userCrews == null){
      CrewService.init(currentAuth.uid);
    }

    $scope.crews = CrewService.userCrews;

  };

  $scope.launchMission = function(missionId, crewId) {

    crewId = typeof crewId !== 'undefined' ? crewId : null;
    console.log("Launching Mission id: "+missionId);

    $scope.creatingGame = true;

    MissionService.launchMission(currentAuth.uid, crewId, missionId);

  };


  $scope.addNewMission = function() {

    console.log("add new mission");

    var PIN = _.random(100000,999999);

    var newMission = {'name':'default name'};
    MissionService.userMissions[PIN]=newMission;
    MissionService.userMissions[PIN].questions=[];

    // console.log(MissionService.userMissions);

    MissionService.userMissions.$save().then(function() {

      console.log("new mission added");
    });
  };

  $scope.openMissionEditor = function(missionId) {
    $scope.editorMode = true;
    $scope.selectedMission = MissionService.userMissions[missionId];
    $scope.selectedMissionId = missionId;
  };

  $scope.closeMissionEditor = function() {

    $scope.editorMode = false;
    $scope.selectedMission = 0;
    $scope.selectedMissionId = 0;

  };

  $scope.closeSaveMissionEditor = function() {

    //close and save
    var id = $scope.selectedMissionId;
    MissionService.userMissions[id] = $scope.selectedMission;

    MissionService.userMissions.$save().then(function() {
      $scope.editorMode = false;
      $scope.selectedMission = 0;
      $scope.selectedMissionId = 0;
    });

  };


  $scope.addNewQuestion = function(missionId) {

    console.log("add new question");

    //if mission is new, create needed data and vars
    var qNumber = 1;
    if(MissionService.userMissions[missionId].questions !=null)
    {
      qNumber = MissionService.userMissions[missionId].questions.length+1;
    }
    else{
      MissionService.userMissions[missionId].questions=[];
    }

    var newQuestion  = {
        'q':'dummy question '+(qNumber),
        'image':'image url',
        'wrong_answers' : ['Wrong Answer 1', 'Wrong Answer 2', 'Wrong Answer 3'],
        'answer' : 'Right Answer',
        'total' : 0,
        'right' : 0,
        'wrong' : 0,
        'na' : 0
    };

    MissionService.userMissions[missionId].questions.push(newQuestion);
    MissionService.userMissions.$save().then(function() {

      console.log("new question added");
      $scope.selectedMission = MissionService.userMissions[missionId];
    });
  };


  $scope.deleteQuestion = function(index) {

    var id = $scope.selectedMissionId;
    MissionService.userMissions[id].questions.splice(index, 1);

    MissionService.userMissions.$save().then(function() {
      console.log("question at index: "+index+" deleted");
    });

  }


  $scope.myUpdateHandler = function(value) {

    //!it justs updates the scope var internally.
    //scope is saved to firebase when editor is closed.

    var id = $scope.selectedMissionId;

    console.log("value: "+value+" id: "+id);
    console.log($scope.selectedMission);

  };


  $scope.deleteMission = function(missionId) {

    console.log("delete mission "+missionId);

    MissionService.userMissions[missionId]=[];


    MissionService.userMissions.$save().then(function() {
      console.log("mission deleted");
      $scope.closeMissionEditor();
    });
  };

}]);
