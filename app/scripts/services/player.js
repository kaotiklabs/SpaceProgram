'use strict';

/**
 * @ngdoc service
 * @name loreAcademyApp.Player
 * @description
 * # Player
 * Service in the loreAcademyApp.
 */
angular.module('spaceProgramApp')
  .service('Player', function (fbutil, $cookieStore) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this, _so;

    self.userProfile;


    self.getUniqId = function() {
    	// generate a unique idenftifier for the player and save it in a cookie to allow refreshes
    	if($cookieStore.get('playerId')) {
    		return self._id = $cookieStore.get('playerId');
    	} else {
    		$cookieStore.put('playerId', _.random(0,999999999)) ;
    		return self._id = $cookieStore.get('playerId');
    	}
    };

    self._connect = function(PIN) {
      console.log("player conect");
    	// common function between self.join, and self.init
    	// creates a connection to firebase backend
		self.syncObject = fbutil.syncObject('games/' + PIN);
    	_so = self.syncObject;
    	return _so.$loaded();
    };


    self._getCrew = function() {

      var uid = _so.data.uid;
      var crewid = _so.data.crewid;

      var userCrew = fbutil.syncObject('crews/'+uid+'/'+crewid+'/members');

  		return userCrew.$loaded();

    };


    self._checkAccess = function(crew, screenName) {

      var ret = false;
      console.log("check access");

      crew.forEach( function (member)
      {
        if(member.pin == screenName){
          self.userProfile = member;
          ret = true;
        }
      });

      return ret;

    };



    self.join = function(PIN, screenName) {

      console.log("player joining");

      return self._connect(PIN)
      .then (function() {

        //unexistent mission
        if(_so.data == null){
            console.log("no data returned");
            return null;
        }

        // if private mission, check auth
        if(_so.data.crewid != null)
        {

          return self._getCrew()
          .then (function(crew){
            var authValue = self._checkAccess(crew, screenName);

            if(authValue == null || authValue == false)
            {
              //not auth
              return null;
            }else{
              //private login procedure
              console.log("access granted to private mission "+PIN);
              return self._privateLogin(PIN, screenName);
            }

          });

        }else{
          //open login procedure
          console.log("access granted to open mission "+PIN);
          return self._openLogin(PIN, screenName);
        }

      });
    };


    self._openLogin = function(PIN, screenName){

      console.log("open login in");

      // register this user to a specific game (identified by PIN)
      self.PIN = PIN;
      self.screenName = screenName;

          // if a /users  node doesn't exist yet, create it
      if(! _so.data.hasOwnProperty('users')) {
        _so.data.users = {};
      }
          // register this players info on the /users node
          // so host and other players are aware of them
      _so.data.users[self.getUniqId()] = {
        screen_name : screenName,
        rank : 0,
        currentScore : 0,
        currentPoints : 0
      };

      return _so.$save();
    };

    self._privateLogin = function(PIN, screenName){

      console.log("private login in");

      // register this user to a specific game (identified by PIN)
      self.PIN = PIN;

          // if a /users  node doesn't exist yet, create it
      if(! _so.data.hasOwnProperty('users')) {
        _so.data.users = {};
      }
          // register this players info on the /users node
          // so host and other players are aware of them
      _so.data.users[self.getUniqId()] = {
        pin : self.userProfile.pin,
        rank : self.userProfile.rank,
        screen_name : self.userProfile.surname + ", "+self.userProfile.name,
        currentScore : 0,
        currentPoints : 0
      };

      return _so.$save();
    };


    self.init = function(PIN) {
        // get unique id from cookie store and connect to backend
		self.getUniqId();
		return self._connect(PIN);
    };

    self.saveSelfAttr = function(attr, val) {
        _so.data.users[self._id][attr] = val;
        return _so.$save();
    };

  });
