'use strict';
/**
* @ngdoc function
* @name muck2App.controller:AccountCtrl
* @description
* # AccountCtrl
* Provides rudimentary account management functions.
*/
angular.module('spaceProgramApp')
.controller('CrewCtrl', ["$scope", "auth", "currentAuth", "fbutil", "$location", "CrewService", "MissionService",
function ($scope, auth, currentAuth, fbutil, $location, CrewService, MissionService) {


  $scope.goalKnobOptions = {
    size:156,
    displayPrevious: true,
    unit: "%",
    readOnly: true,
    trackWidth: 30,
    barWidth: 20,
    subText: {
      enabled: true,
      text: 'Goal'
    },
    trackColor: 'rgba(44,151,222,.2)',
    barColor: 'rgba(44,151,222,1)',
    textColor: 'rgba(43,62,81,1)'
  };

  $scope.shipKnobOptions = {
    size:156,
    displayPrevious: true,
    unit: "%",
    readOnly: true,
    trackWidth: 30,
    barWidth: 20,
    subText: {
      enabled: true,
      text: 'Ship Status'
    },
    trackColor: 'rgba(44,151,222,.2)',
    barColor: 'rgba(44,151,222,1)',
    textColor: 'rgba(43,62,81,1)'
  };

  $scope.user = {
    uid: currentAuth.uid,
    name: currentAuth.displayName,
    photo: currentAuth.photoURL,
    email: currentAuth.email
  };

  $scope.authInfo = currentAuth;

  $scope.averagePoints = 0;
  $scope.averageScore = 0;
  $scope.averageRank = 0;

  $scope.pageMode = 'defaultMode';
  $scope.selectedCrew;

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

  $scope.addNewCrew = function() {

    console.log("add new crew");

    var PIN = _.random(100000,999999);

    var newCrew = {
      'name':'default name',
      'score':0,
      'shipVar1':50,
      'shipVar2':50,
      'shipVar3':50
    };

    CrewService.userCrews[PIN]=newCrew;
    CrewService.userCrews[PIN].members=[];

    // console.log(MissionService.userMissions);

    CrewService.userCrews.$save().then(function() {

      console.log("new mission added");
    });
  };


  $scope.launchMission = function(missionId, crewId) {

    crewId = typeof crewId !== 'undefined' ? crewId : null;
    console.log("Launching Mission id: "+missionId);

    $scope.creatingGame = true;

    MissionService.launchMission(currentAuth.uid, crewId, missionId);

  };

  $scope.openCrewEditor = function(crewId) {
    $scope.pageMode = 'editorMode';
    $scope.selectedCrew= CrewService.userCrews[crewId];
    $scope.selectedCrewId = crewId;
  };

  $scope.closeCrewEditor = function() {

    $scope.pageMode = 'defaultMode';
    $scope.selectedCrew = 0;
    $scope.selectedCrewId = 0;

  };

  $scope.closeSaveCrewEditor = function() {

    //close and save
    var id = $scope.selectedCrewId;
    // CrewService.userCrews[id] = $scope.selectedCrew;

    CrewService.userCrews.$save().then(function() {
      $scope.pageMode = 'defaultMode';
      $scope.selectedCrew = 0;
      $scope.selectedCrewId = 0;
    });

  };

  $scope.openCrewStats = function(crewId) {
    $scope.pageMode = 'statsMode';
    $scope.selectedCrew= CrewService.userCrews[crewId];
    $scope.selectedCrewId = crewId;

    $scope.averagePoints = 0;
    $scope.averageScore = 0;
    $scope.averageRank = 0;

    //calculate crew stats
    angular.forEach($scope.selectedCrew.members, function(member, key) {
      $scope.averagePoints += (member.points/$scope.selectedCrew.members.length);
      $scope.averageScore += 0;
      $scope.averageRank += (member.rank/$scope.selectedCrew.members.length);
    });


  };

  $scope.closeCrewStats = function() {

    $scope.pageMode = 'defaultMode';
    $scope.selectedCrew = 0;
    $scope.selectedCrewId = 0;

    $scope.averagePoints = 0;
    $scope.averageScore = 0;
    $scope.averageRank = 0;

  };

  $scope.openCrewPinList = function(crewId) {
    $scope.pageMode = 'pinListMode';
    $scope.selectedCrew= CrewService.userCrews[crewId];
    $scope.selectedCrewId = crewId;
  };

  $scope.closeCrewPinList = function() {

    $scope.pageMode = 'defaultMode';
    $scope.selectedCrew = 0;
    $scope.selectedCrewId = 0;

  };

  $scope.addNewMember = function() {

    var id = $scope.selectedCrewId;

    if(CrewService.userCrews[id].members == null){
      CrewService.userCrews[id].members=[];
    }

    console.log("add new member");

    var PIN = _.random(100000,999999);

    var newMember  = {
        'name':'name',
        'surname':' surnames',
        'image':'images/default.jpg',
        'rank':0,
        'points':0,
        'score':0,
        'games':0,
        'questions':0,
        'pin': PIN
    };

    CrewService.userCrews[id].members.push(newMember);

    CrewService.userCrews.$save().then(function() {
      $scope.crews = CrewService.userCrews;
      $scope.selectedCrew = CrewService.userCrews[id];
      console.log("new member added");
    });
  };

  $scope.deleteMember = function(item) {

    var id = $scope.selectedCrewId;
     CrewService.userCrews[id].members.splice(CrewService.userCrews[id].members.indexOf(item),1);

    CrewService.userCrews.$save().then(function() {
      $scope.crews = CrewService.userCrews;
      $scope.selectedCrew = CrewService.userCrews[id];
      console.log("member deleted");
    });

  }

  $scope.myUpdateHandler = function(newValue) {

    console.log("updating text");
    console.log(newValue);
  }


  $scope.deleteCrew = function() {

    var id = $scope.selectedCrewId;
    console.log("deleting crew "+id);

    CrewService.userCrews[id]=[];


    CrewService.userCrews.$save().then(function() {
      console.log("crew deleted");
      $scope.closeCrewEditor();
    });
  };


  $scope.OpenMemberCareer = function(memberId){

    var crewId = $scope.selectedCrewId;
    console.log("opening career of crew "+crewId+" PIN "+memberId);


    $location.path('/career/'+crewId+'/'+memberId);




  };

}]);
