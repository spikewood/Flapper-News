var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// This function gets the list of the posts
router.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		if (err) { next(err); }

		res.json(posts);
	});
});

//this function will get the comments for a given id
router.get('/posts/:post/comments', function(req, res, next){
	Post.find(function(err, posts){
		if (err) { next(err); }

		res.json(posts);
	});
});

// This function will post the data to the Post mongoose model
router.post('/posts', function(req, res, next){
	var post = new Post(req.body);

	post.save(function(err, post){
		if (err) { return next(err); }

		res.json(post);
	});
});

// This function will post the data to the Comment mongoose model for a post
router.post('/posts/:post/comments', function(req, res, next){
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment){
		if (err) { return next(err); }

		req.post.comment.push(comment);
		req.post.save(function(err, post) { //why post and not comment
			if (err) { return next(err); }

			res.json(comment)
		}
	});
});

// This function will return the post based on the id
router.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function(err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error("can't find post")); }

		req.post = post;
		return next();
	})
});

// This get will return the post in json format 
router.get('/posts/:post', function(req, res) {
	res.json(req.post);
});

// This function will upvote a post based on its id
router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post) {
		if (err) { return next(err); }

		res.json(post);
	});
});

module.exports = router;
