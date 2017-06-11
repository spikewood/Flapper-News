//Always need mongoose
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// Schema for the Mongo DB goes here

// Each user will have a username, a password (stored in the hash), and a salt to encrypt the password
var UserSchema = new mongoose.Schema({
	username: {type:String, lowercase:true, unique:true},
	hash: String,
	salt: String,
});

// Functions to run in the schema go here

// setPassword method will set the password by salting the password and encrypting it
UserSchema.methods.setPassword = function(password) {
	// salt with 16 bytes of random
	this.salt = crypto.randomBytes(16).toString('hex');

	// encrypt password with the salt and hash 1000 times
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

// validPassword method will set the password by salting the password and encrypting it
UserSchema.methods.validPassword = function(password) {
	// encrypt password with the salt and hash 1000 times
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

	return this.hash === hash;
}

// generateJWT method genrates a web token good for 60 days
UserSchema.methods.generateJWT = function() {
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);

	return jwt.sign({
		_id: this._id,
		username: this.username,
		exp: parseInt(exp.getTime() / 1000)
	}, 'SECRET');
}

//Model compilation
mongoose.model('User', UserSchema);