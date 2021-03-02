'use strict';

/**
 * @ngdoc function
 * @name loreAcademyApp.controller:HostCtrl
 * @description
 * # HostCtrl
 * Controller of the loreAcademyApp
 */

angular.module('spaceProgramApp')
  .controller('HostCtrl', function ($scope, Host, Trivia, $routeParams,$interval,fbutil, $location, $timeout) {

    var timeToAnswer = 10;
    var timeBetweenQuestions = 5;

    $scope.questionChartLabels = ["Right", "Wrong", "N/A"];
    $scope.questionChartData = [0, 0, 0];
    // $scope.questionChartColors = ['#2C3E50','#FD1F5E'];
    $scope.questionChartColors = ['#00B0DA','#FD1F5E', '#BDD2DD'];

    $scope.answerColors = ['#00A1F1', '#7CBB00', '#FFBB00', '#F65314'];

    $scope.answerChartMark;

    // $scope.answerChartColors = ['rgba(247,70,74,1)', 'rgba(70,191,189,1)'];
    $scope.answerChartColors = ['#00A1F1', '#7CBB00', '#FFBB00', '#F65314'];
    $scope.answerChartOverride = {
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 3
    };

    $scope.answerChartData = [0, 0, 0, 0];
    $scope.answerChartLabels = ["A", "B", "C", "D"];
    $scope.answerchartOptions = {
      'responsive' : true,
      'maintainAspectRatio' : true,
      'legend': {
        'display': false
      },
      'scales': {
        'xAxes': [{
          'display': false,
          'gridLines': {'display':false}
        }],
        'yAxes': [{
          'ticks': {'min': 0},
          'display': false,
          'gridLines': {'display':false}
        }]
      }
    };

    $scope.leaderChartData = [];
    $scope.leaderChartLabels = [];
    $scope.leaderChartOptions = {
      legend: {
        display: true
      },
      scales: {
        //yAxes: [{ticks: {min: 0, max:100}}],
        xAxes: [{ticks: {min: 0, max:300}}]
        //xAxes: [{id: 'x-axis-1', type: 'linear', position: 'left', ticks: {min: 0, max:100}}]
      }
    };

    gameInit();

    function gameInit(){
      console.log("calling game init");
      Host.init($routeParams.PIN).then(function(){
        console.log("game init DONE");
        gameSetup();
      });
    };

    function gameSetup(){
      console.log("calling game setup");
      Host.setupGame().then(function(){
        console.log("game setup DONE");

        gameStateManager();
      });
    };

    function gameStateManager() {
        //console.log(Host);
    		Host.gameRef.$bindTo($scope, 'game');

    		$scope.$watch('game.data.state', function(newValue, oldValue) {

    			switch(newValue) {

            case 'launch':
    					$scope.countdown = timeBetweenQuestions;
    					$interval(function() {
    						$scope.countdown--;
    					},1000, $scope.countdown)
    					.then(function() {
    						Host.setGameState('question');
    					});
    					break;

    				case 'preQuestion':
    					$scope.countdown = timeBetweenQuestions;
    					$interval(function() {
    						$scope.countdown--;
    					},1000, $scope.countdown)
    					.then(function() {
    						Host.setGameState('question');
    					});
    					break;

  				case 'question':
              //reset charts
              $scope.questionChartData = [0, 0, 0];
              $scope.answerChartData = [0, 0, 0, 0];

              $scope.currentQuestion = Host.getCurrentQuestion();
              $scope.answers = Trivia.getPossibleAnswers($scope.currentQuestion);
              $scope.game.data.possibleAnswers = $scope.answers;
  					  $scope.countdown = timeToAnswer;
    					$interval(function() {
    						$scope.countdown--;
    					},1000, $scope.countdown)
    					.then(function() {
    						Host.setGameState('postQuestion');
    					});
    					break;

  				case 'postQuestion':

            console.log("post question");
            $scope.correct = [];
  					$scope.currentQuestion = Host.getCurrentQuestion();
            $scope.answerChartMark = Host.getRightAnswerIndex();


            angular.forEach($scope.game.data.users, function(v,k) {

              //fill answer chart bar array with users answers
              angular.forEach($scope.game.data.possibleAnswers, function(value,key) {
                //increment corresponding  chart bar
                if(value == v.currentAnswer){
                  $scope.answerChartData[key]++;
                }
              });

              //if user question answer marks not init, do it
              if(v.total == null) v.total = 0;
              if(v.right == null) v.right = 0;
              if(v.wrong == null) v.wrong = 0;
              if(v.na == null) v.na = 0;

              v.total++;

              // check if user answer is right, wrong or not answered and assign points
              switch (Host.checkAnswer(v.currentAnswer)) {
                case true:
                  v.currentPoints = (v.currentPoints || 0) + 100;
                  v.currentScore = (v.currentScore || 0) + (10/$scope.game.questions.length);
                  v.right++;
                  $scope.correct.push(v.screen_name);
                  //chart right answer
                  $scope.questionChartData[0]++;
                  // console.log("answer true");
                  break;

                case false:
                  //chart wrong answer
                  $scope.questionChartData[1]++;
                  v.wrong++;
                  // console.log("answer false");
                  break;

                default:
                  //chart not answered
                  $scope.questionChartData[2]++;
                  v.na++;
                  // console.log("not answered");
                  break;
              }

            });
            Host.gameRef.$save();

            $scope.leaderboard = _.map($scope.game.data.users, function(user) {
              return {
                screen_name:user.screen_name,
                current_points:user.currentPoints
              }
            });

  					break;

          case 'leaderboard':
            //leaderboard chart

            angular.forEach($scope.game.data.users, function(value, index){
              if(value.currentPoints == null)value.currentPoints = 0;
              $scope.leaderChartLabels.push(value.screen_name);
              $scope.leaderChartData.push(value.currentPoints);
            })


            $scope.leaderboard = _.map($scope.game.data.users, function(user) {
              return {
                screen_name:user.screen_name,
                current_points:user.currentPoints
              }
            });

          } //end switch

    		})
    };

    function SaveResults (){

      console.log("Saving results...");

      var userCrew = fbutil.syncObject('crews/'+$scope.game.data.uid+'/'+$scope.game.data.crewid+'/members');

      userCrew.$loaded().then(function(){

        var missionid = $scope.game.data.missionid;
        var currentDate = + new Date();

        //loop game users list
        angular.forEach($scope.game.data.users, function(value, index){

          //loop crew list
          userCrew.forEach(function (userProfile){

            //search for user inside crew list
            if(value.pin == userProfile.pin){

              //if no scores tree, create it
              if(userProfile.missions == null){
                userProfile.missions = [];
              }

              //if no mission, create it
              if(userProfile.missions[missionid] == null){
                userProfile.missions[missionid] = [];
              }

              //--------
              //Update Player Current Game stats
              //--------

              var currentGame = {
                date : currentDate,
                gameid : $routeParams.PIN,
                points : value.currentPoints,
                score : value.currentScore,
                total: $scope.game.questions.length,
                right: value.right,
                wrong: value.wrong,
                na: value.na
              };
              //push current game to userProfile
              userProfile.missions[missionid].push(currentGame);


              //--------
              //Update Player stats
              //--------

              //update total values and compute rank
              userProfile.points = Number(userProfile.points + value.currentPoints);
              userProfile.games = Number(userProfile.games + 1);
              userProfile.questions = Number(userProfile.questions + $scope.game.questions.length);

              //HACK guarro, segurament hi ha manera molt més optima
              //median total score (scores/games)
              var bufGameCounter=0;
              var bufTotalScore=0;

              angular.forEach(userProfile.missions, function(mvalue, mkey) {
                angular.forEach(mvalue, function(gvalue, gkey) {
                  bufGameCounter++;
                  bufTotalScore += gvalue.score;
                });
              });

              userProfile.score  = bufTotalScore / bufGameCounter;

              userProfile.rank = Math.floor(0.04 * Math.sqrt(userProfile.points));

            }

          });
        });

        console.log("Save results");
        userCrew.$save();

      });


    }

  	$scope.startGame = function() {

      var numUsers = 0;

      angular.forEach($scope.game.data.users, function(mvalue, mkey) {
        numUsers++;
      });

      if(numUsers > 0) {
        console.log("Launching game for "+ numUsers+" users.");
        $scope.game.data.state = 'launch';
      }else{
        console.log("No users! Can't Launch Game!");
      }

  	};


    $scope.nextQuestion = function() {
      // $scope.game.data.currentQuestion++;
      Host.nextQuestion();
    };

    $scope.endGame = function() {

      if($scope.game.data.crewid != null){
        console.log("Private game!");
        SaveResults();
      }

      Host.setGameState('leaderboard');
    };

    $scope.exitGame = function() {
      $timeout(function () {
          $location.path('/');
      }, 0);
    };

  });
