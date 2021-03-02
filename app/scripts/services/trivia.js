'use strict';

/**
* @ngdoc service
* @name loreAcademyApp.Trivia
* @description
* # Trivia
* Service in the loreAcademyApp.
*/
angular.module('spaceProgramApp')
// .service('Trivia', function (_, $firebase, $firebaseObject) {
.service('Trivia', function ($firebase, $firebaseObject) {
  // AngularJS will instantiate a singleton by calling "new" on this function

  var self = this;


  self.getPossibleAnswers = function(question) {
    return _.shuffle([question.answer].concat(question.wrong_answers));
  };

  self.checkAnswer = function(questionText, answer) {
    console.log('Checking:');

    var question = _.find(self.questions, function(q) {
      return q.q == questionText;
    });
    console.log(questionText, answer, question.answer == answer);
    return question.answer == answer;
  };


});
