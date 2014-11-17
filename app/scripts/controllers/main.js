'use strict';
/*global Firebase: true */

// the code below is horrible, no one should write code like this in a controller
// sole purpose of this code is to have fun with awesome WebSockets technology

angular.module('izbavimeApp')
  .controller('MainCtrl', function ($scope, $firebase, $firebaseSimpleLogin) {

  	var ref = new Firebase('https://izbavime.firebaseio.com/messages/');

  	// var sync = $firebase(ref.limit(1));
  	var sync = $firebase(ref);

  	$scope.notices = sync.$asArray();

    $scope.submitNewMessage = function(){
    	if($scope.user){
    		$scope.notices.$add({text: $scope.newMessage, user: $scope.user.displayName, createdAt: Firebase.ServerValue.TIMESTAMP });
            $scope.newMessage = '';
    	}
    	else {
    		// alert('You have to log in');
    	}
    };

    $scope.loaded = false;
    $scope.authClient = $firebaseSimpleLogin(ref);
    
    $scope.authClient.$getCurrentUser().then(function(){
    	$scope.loaded = true;
    });
    
    $scope.$watch('authClient.user', function(){
    	$scope.user = $scope.authClient.user;
    });

    $scope.logIn = function(provider){
    	$scope.authClient.$login(provider).then(function(user){
    		$scope.user = user;
    	});
    };

    $scope.logOut = function(){
    	$scope.authClient.$logout();
    };

  });
