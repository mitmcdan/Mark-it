var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var AdminSchema = new Schema({
  _id:  Number,
  username: {
        type: String,
        trim: true,
        unique: true
    },
  hash: String,
  salt: String,
  name: String,
  county: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number},
  phone: Number,
  email: String,
  website: String,
});

AdminSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

AdminSchema.methods.validPassword = function(password){
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

AdminSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = mongoose.model('admin', AdminSchema,'admin');