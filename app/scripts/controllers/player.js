'use strict';

/**
 * @ngdoc function
 * @name loreAcademyApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the loreAcademyApp
 */
angular.module('spaceProgramApp')
  .controller('PlayerCtrl', function ($rootScope, $scope, Player, Trivia,$location, $timeout, $routeParams) {

    $scope.answerColors = ['#00A1F1', '#7CBB00', '#FFBB00', '#F65314'];
    $scope.answerBuf = null;

    $rootScope.userIsPlaying = true;

    if(! $routeParams.hasOwnProperty('PIN')) {
  		$scope.game = {
  			data : {
  				state: 'joinGame'
  			}

  		}
  	} else {
  		Player.init($routeParams.PIN)
      .then(function() {
        $scope.clearAnswer();
      })
  		.then(function() {

  			Player.syncObject.$bindTo($scope,'game')
        .then(function() {

          $scope.currentQuestion = $scope.game.questions[$scope.game.data.currentQuestion];

          $scope.$watch('game.data.currentQuestion' , function(newValue, oldValue)
          {
            $scope.clearAnswer();
            $scope.currentQuestion = $scope.game.questions[$scope.game.data.currentQuestion];
          });

        });

        $scope.playerId = Player.getUniqId();

  		});
  	}

    $scope.join = function() {
    	$scope.joining = true;

      Player.join($scope.PIN, $scope.screenName)
    	.then(function(data)
      {
        if(data != null){
      		$location.path('/player/' + $scope.PIN);
        }else{
          console.log("access denied");
          $scope.game.data.state = "accessdenied";
        }
    	});
    };

    $scope.clearAnswer = function() {
      $scope.answerBuf = null;
      Player.saveSelfAttr('currentAnswer', null);
    }

    $scope.saveAnswer = function(answer) {
      $scope.answerBuf = answer;
      Player.saveSelfAttr('currentAnswer', answer);
    };

    $scope.exitGame = function() {
      $timeout(function () {
          $rootScope.userIsPlaying = false;
          $location.path('/');
      }, 0);
    };

  });
