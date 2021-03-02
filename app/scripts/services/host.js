'use strict';

/**
 * @ngdoc service
 * @name loreAcademyApp.Host
 * @description
 * # Host
 * Service in the loreAcademyApp.
 */
angular.module('spaceProgramApp')
  .service('Host', function (fbutil) {

    var self = this;

    self.init = function(PIN) {

      self.gameRef = [];
    	self.gameRef = fbutil.syncObject('games/' + PIN);

      return self.gameRef.$loaded();
    };

    self.setupGame = function() {
      self.gameRef.data.currentQuestion = 0;

    	return self.gameRef.$save();
    };

    self.getCurrentQuestion = function() {

      return self.gameRef.questions[self.gameRef.data.currentQuestion];
    };


    self.setGameState = function(state) {
        self.gameRef.data.state = state;
        return self.gameRef.$save();
    };

    self.nextQuestion = function() {
        self.gameRef.data.state = 'preQuestion';
        self.gameRef.data.currentQuestion++;
        return self.gameRef.$save();
    }


    self.getRightAnswerIndex = function() {

      var ret = 0;
      var rightAnswer = self.getCurrentQuestion().answer;

      angular.forEach(self.gameRef.data.possibleAnswers, function(value,key) {
          if(value == rightAnswer){
              ret = key;
          }
      });

      return ret;
    }


    self.checkAnswer = function(answer) {

      var currentQuestion = self.gameRef.data.currentQuestion;
      var rightAnswer = self.gameRef.questions[currentQuestion].answer;

      // console.log("Right: "+rightAnswer+" User: "+answer);

      //check for undefined
      if (typeof answer == 'undefined'){
        return null;
      }else{
        return (rightAnswer == answer);
      }
    }

  });
