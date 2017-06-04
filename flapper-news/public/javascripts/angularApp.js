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
    	controller: 'MainCtrl',
    	resolve: {
    		postPromise: ['posts', function(posts){
    			return posts.getAll();
    		}]
    	}
    });

    $stateProvider.state('posts', {
		  url: '/posts/{id}',
		  templateUrl: '/posts.html',
		  controller: 'PostsCtrl',
		  resolve: {
		    post: ['$stateParams', 'posts', function($stateParams, posts) {
		      return posts.get($stateParams.id);
		    }]
		  }
		});

	$urlRouterProvider.otherwise('home');
}]);

// app factory for storing data between views
app.factory('posts', ['$http', function($http){
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

}]);

// app controller for the posts
app.controller('PostsCtrl', [
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
]);
