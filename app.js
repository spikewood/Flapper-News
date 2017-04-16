var app = angular.module('flapperNews', []);

app.controller('MainCtrl', [
'$scope',
function($scope){
  $scope.title = '';

  $scope.posts = [
  {title: 'post 1', upvotes: 12},
  {title: 'post 2', upvotes: 34},
  {title: 'post 3', upvotes: 21},
  {title: 'post 4', upvotes: 45}
  ];

  $scope.addPost = function(){
  	if ($scope.title === '') { return;}
  	$scope.posts.push({title: $scope.title, upvotes: 36});
  	$scope.title = '';
  }
}]);
