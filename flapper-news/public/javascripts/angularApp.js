var app = angular.module('flapperNews', ['ui.router']);

// application configuration values
app
.config([
	'$stateProvider',
	'$urlRouterProvider',

	//State controller for the application states
	function($stateProvider, $urlRouterProvider) {	
		$stateProvider

			.state('home', {
	    	url: '/home',
	    	templateUrl: '/home.html',
	    	controller: 'MainCtrl',
	    	resolve: {
	    		postPromise: ['posts', function(posts){
	    			return posts.getAll();
	    		}]
	    	}
	    })

	    .state('posts', {
			  url: '/posts/{id}',
			  templateUrl: '/posts.html',
			  controller: 'PostsCtrl',
			  resolve: {
			    post: ['$stateParams', 'posts', function($stateParams, posts) {
			      return posts.get($stateParams.id);
			    }]
			  }
			})

			.state('login', {
			  url: '/login',
			  templateUrl: '/login.html',
			  controller: 'AuthCtrl',
			  onEnter: ['$state', 'auth', function($state, auth){
			    if(auth.isLoggedIn()){
			      $state.go('home');
			    }
			  }]
			})

			.state('register', {
			  url: '/register',
			  templateUrl: '/register.html',
			  controller: 'AuthCtrl',
			  onEnter: ['$state', 'auth', function($state, auth){
			    if(auth.isLoggedIn()){
			      $state.go('home');
			    }
			  }]
			})

		$urlRouterProvider.otherwise('home');
	}])

.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {};

	// saveToken stores the generated token into local storage to keep folks logged in
	auth.saveToken = function (token){
	  $window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function (){
	  return $window.localStorage['flapper-news-token'];
	};

	//isLoggedIn compares the expiration date from the window vs today's date
	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  if(token){
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.exp > Date.now() / 1000;
	  } else {
	    return false;
	  }
	};

	// username pulls the username from the window if the user is logged in
	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.username;
	  }
	};

	// register saves the token to the window
	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	// login saves the token to the window
	auth.login = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data, token);
		});
	};

	// logout removes the token from the window
	auth.logout = function() {
		$window.localStorage.removeItem('flapper-news-token');
	};

	return auth;
}])

// Controller for Authentication
.controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
	function($scope, $state, auth){
	  $scope.user = {};

	  $scope.register = function(){
	    auth.register($scope.user).error(function(error){
	      $scope.error = error;
	    }).then(function(){
	      $state.go('home');
	    });
	  };

	  $scope.logIn = function(){
	    auth.logIn($scope.user).error(function(error){
	      $scope.error = error;
	    }).then(function(){
	      $state.go('home');
	    });
	  };
}])

// Auth nav controller
.controller('NavCtrl', [
	'$scope',
	'auth',
	function($scope, auth){
	  $scope.isLoggedIn = auth.isLoggedIn;
	  $scope.currentUser = auth.currentUser;
	  $scope.logOut = auth.logOut;
}])

// app factory for storing data between views
.factory('posts', ['$http', function($http){
  var o = {
    posts: []
  };

  o.getAll = function() {
  	return $http.get('/posts').success(function(data) {
  		angular.copy(data, o.posts);
  	});
  };

  o.get = function(id) {
	  return $http.get('/posts/' + id).then(function(res){
	    return res.data;
	  });
	};

	o.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	};

  o.create = function(post) {
  	return $http.post('/posts', post).success(function(data){
    	o.posts.push(data);
  	});
	};

  o.upvote = function(post) {
  return $http.put('/posts/' + post._id + '/upvote')
    .success(function(data){
      post.upvotes += 1;
    });
	};

	o.upvoteComment = function(post, comment) {
	  console.log('this is the: ',post);
	  console.log('this is the: ',comment);
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
	    .success(function(data){
	      comment.upvotes += 1;
	    });
	};
  
  return o;
}])

// app controller for the Main View
.controller('MainCtrl', [
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
			// fill out the post
			posts.create({
				title: $scope.title,
				link: $scope.link,
  		});
	  		$scope.title = '';
	  		$scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
  		posts.upvote(post);
		};

}])

// app controller for the posts
.controller('PostsCtrl', [
	'$scope',
	'posts',
	'post',
	function($scope, posts, post){
		$scope.post = post;

		$scope.addComment = function(){
		  if($scope.body === '') { return; }
		  posts.addComment(post._id, {
		    body: $scope.body,
		    author: 'user',
		  }).success(function(comment) {
		    $scope.post.comments.push(comment);
		  });
		  $scope.body = '';
		};

		$scope.incrementUpvotes = function(comment){
  		console.log('before the upvote call post is: ', post);
  		console.log('before the upvote call posts.upvoteComment is: ', posts.upvoteComment);
  		console.log('before the upvote call comment is: ', comment);
  		posts.upvoteComment(post, comment);
  		console.log('after the upvote call post is: ', post);
  		console.log('after the upvote call posts is: ', posts);
  		console.log('after the upvote call comment is: ', comment);
		};
	}
])
