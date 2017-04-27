var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


/**********************
--Posts
***********************/

// This function gets the list of the posts
router.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		if (err) { next(err); }

		res.json(posts);
	});
});

// This function will post the data to the Post mongoose model
router.post('/posts', function(req, res, next){
	// we create a post from the post model seeded with the request body
	var post = new Post(req.body);

	// we save the post and return the post json as a response
	post.save(function(err, post){
		if (err) { return next(err); }

		res.json(post);
	});
});

// This function will return a post based on the parmeter id
router.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function(err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error("can't find post")); }

		req.post = post;
		return next();
	})
});

// This get will return the post json based on the post id
router.get('/posts/:post', function(req, res) {
	res.post.populate('comments', function(err, post){
		if (err) { return next(err); }

		res.json(req.post);
	});

	
});

// This function will upvote a post based on its id
router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post) {
		if (err) { return next(err); }

		res.json(post);
	});
});

/**********************
--Comments
***********************/

//this function will get the comments for a given id
router.get('/posts/:post/comments', function(req, res, next){
	
	Post.find(function(err, posts){
		if (err) { next(err); }

		res.json(posts);
	});
});

// This function will return the comment based on the parameter id
router.param('comment', function(req, res, next, id){
	var query = Comment.findById(id);

	query.exec(function(err, comment){
		if (err) { return next(err); }
		if (!comment) { return next(new Error("can't find comment")); }

		req.comment = comment;
		return next();
	})
});

// This function will post the data to the Comment for a Post
router.post('/posts/:post/comments', function(req, res, next){
	// create a comment from the mongoose comment model seeded with the request body
	var comment = new Comment(req.body);
	// tie the comment to the post with the post id in the comment model
	comment.post = req.post;

	// save the comment model - the callback needs the comment as the 2nd argument
	comment.save(function(err, comment){
		// if we get errors they need to be handled
		if (err) { return next(err); }

		// push the comment to the comment array
		req.post.comment.push(comment);
		// save the post to include the comment in its comment array
		req.post.save(function(err, post) {
			if (err) { return next(err); }
			// respond with the comment as json
			res.json(comment)
		}
	});
});

// This function will upvote a post based on its id
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if (err) { return next(err); }

		res.json(comment);
	});
});

module.exports = router;
