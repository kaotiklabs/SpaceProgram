'use strict';
/**
* @ngdoc function
* @name muck2App.controller:AccountCtrl
* @description
* # AccountCtrl
* Provides rudimentary account management functions.
*/
angular.module('spaceProgramApp')
.controller('CareerCtrl', ["$scope", "auth", "currentAuth", "CrewService", "fbutil", "$routeParams",
function ($scope, auth, currentAuth, CrewService, fbutil, $routeParams) {

  $scope.user = {
    uid: currentAuth.uid,
    name: currentAuth.displayName,
    photo: currentAuth.photoURL,
    email: currentAuth.email
  };

  $scope.authInfo = currentAuth;

  $scope.member;

  $scope.totalScore = 0;
  $scope.totalPoints = 0;
  $scope.totalGames = 0;
  $scope.totalMissions = 0;


  $scope.mainChart = {
     'labels' : [],
     'data' : [],
    //  'colors': ['rgba(151,187,205,0.6)'],
     'options' : {
        'showScale' : false,
        'showTooltips' : false,
        'responsive' : true,
        'maintainAspectRatio' : true,
        'pointDot' : false,
        'bezierCurve' : true,
        'datasetFill' : false,
        'scales': {
          'yAxes': [{'ticks': {'min':0, 'max':10}}],
        },

        'barShowStroke' : true,
        'barStrokeWidth' : 2,
        'barValueSpacing' : 1,
        'barDatasetSpacing' : 1
     }
  };

  $scope.missionChart = {
     'labels' : [],
     'data' : [],
    //  'colors': ['rgba(151,187,205,0.6)'],
     'options' : {
        'showScale' : false,
        'showTooltips' : false,
        'responsive' : true,
        'maintainAspectRatio' : true,
        'pointDot' : false,
        'bezierCurve' : true,
        'datasetFill' : false,
        'scales': {
          'yAxes': [{'ticks': {'min':0, 'max':10}}],
        },

        'barShowStroke' : true,
        'barStrokeWidth' : 2,
        'barValueSpacing' : 1,
        'barDatasetSpacing' : 1
     }
  };


  init();


  function init(){


    console.log("loading member");

    var uid = currentAuth.uid;
    var crewId = $routeParams.CREWID;
    var memberId = $routeParams.MEMBERID;

    var addedTotalScore = 0;
    var maxGameScore = 0;

    $scope.member = CrewService.getMemberByCrewAndPin(crewId, memberId);
    if($scope.member != null){
      console.log("Found member "+$scope.member.name+" "+$scope.member.surname);

      var mIndex = 0;

      angular.forEach($scope.member.missions, function(mvalue, mkey) {
        $scope.totalMissions++;
        maxGameScore = 0;

        $scope.missionChart.labels[mIndex] = [];
        $scope.missionChart.data[mIndex] = [];

        angular.forEach(mvalue, function(gvalue, gkey) {
          $scope.totalGames++;
          $scope.totalPoints += gvalue.points;

          if(maxGameScore < gvalue.score){
          maxGameScore = gvalue.score;
          }

          $scope.missionChart.labels[mIndex].push("Game "+(gkey+1));
          $scope.missionChart.data[mIndex].push(gvalue.score);

        });

        $scope.mainChart.labels.push("Mission "+mkey);
        $scope.mainChart.data.push(maxGameScore);


        addedTotalScore += maxGameScore;
        mIndex++;
      });
      $scope.totalScore = addedTotalScore / ($scope.totalMissions);
    }else{
      console.log("member not found");
    }


  };

}]);
