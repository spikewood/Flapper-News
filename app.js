var app = angular.module('flapperNews', ['ui.router']);

// application configuration values
app.config([
'$stateProvider',
'$urlRouterProvider',

//State controller for the application states
function($stateProvider, $urlRouterProvider) {
	
    $stateProvider.state('home', {
    	url: '/home',
    	templateUrl: '/home.html',
    	controller: 'MainCtrl'
    });

    $stateProvider.state('posts', {
    	url: '/posts/{id}',
    	templateUrl: '/posts.html',
    	controller: 'PostsCtrl'
    });

	$urlRouterProvider.otherwise('home');
}]);

// app factory for storing data between views
app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}]);

// app controller for the Main View
app.controller('MainCtrl', [
	'$scope',
	'posts',

	// allow users to fill out new posts
	function($scope, posts){
		// init scope variables
		$scope.title = '';
		$scope.link = '';
		$scope.posts = posts.posts;

		$scope.addPost = function(){
			// prevent clicks of button from submitting empty posts
			if ($scope.title === '') { return;}
			// fill ouy the post
			$scope.posts.push({
  				title: $scope.title,
  				link: $scope.link,
  				upvotes: 0,
  				comments: []
			});
	  		$scope.title = '';
	  		$scope.link = '';
		}

		// increment the upvotes on click
		$scope.incrementUpvotes = function(post){
	  		post.upvotes ++;
		}
}]);

// app controller for the posts
app.controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	function($scope, $stateParams, posts){
		$scope.post = posts.posts[$stateParams.id];
	
		$scope.addComment = function(){
	  		if($scope.body === '') { return; }
	  		$scope.post.comments.push({
	    		body: $scope.body,
	   			author: 'user',
	    		upvotes: 0
	  		});
	  		$scope.body = '';
		}
	}
]);
