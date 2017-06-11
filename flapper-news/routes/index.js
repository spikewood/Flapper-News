var express = require('express');
var router = express.Router();

// Authorization token for securing the pages
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var passport = require('passport');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/**********************
--Auth
***********************/

// Register User - this will register a user
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

// Login - 
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


/**********************
--Posts
***********************/

// Get Posts - This route gets the list of the posts
router.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		if (err) { next(err); }

		res.json(posts);
	});
});

// Post to Posts - This function will post the data to the Post mongoose model
router.post('/posts', auth, function(req, res, next){
	// we create a post from the post model seeded with the request body
	var post = new Post(req.body);
	post.author = req.payload.username;
	
	// we save the post and return the post json as a response
	post.save(function(err, post){
		if (err) { return next(err); }

		res.json(post);
	});
});

// Post ID Parameter - This function will return a post based on the parmeter id
router.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function(err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error("can't find post")); }

		req.post = post;
		return next();
	})
});

// Get a Post by ID - This get will return the post json based on the post id
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
})

// Upvote a Post - This function will upvote a post based on its id
router.put('/posts/:post/upvote', auth, function(req, res, next) {
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
router.post('/posts/:post/comments', auth, function(req, res, next){
	// create a comment from the mongoose comment model seeded with the request body
	var comment = new Comment(req.body);
	// tie the comment to the post with the post id in the comment model and bring in the author
	comment.post = req.post;
	comment.author = req.payload.username

	// save the comment model - the callback needs the comment as the 2nd argument
	comment.save(function(err, comment){
		// if we get errors they need to be handled
		if (err) { return next(err); }

		// push the comment to the comment array
		req.post.comments.push(comment);
		// save the post to include the comment in its comment array
		req.post.save(function(err, post) {
			if (err) { return next(err); }
			// respond with the comment as json
			res.json(comment);
		});
	});
});

// This function will upvote a post based on its id
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if (err) { return next(err); }

		res.json(comment);
	});
});

module.exports = router;
