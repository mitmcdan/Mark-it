var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var FarmerSchema = new Schema({
  admin: Boolean,
  hash: String,
  salt: String,
  first_name: String,
  last_name: String,
  farm_name: String,
  county: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number},
  phone: String,
  email: String,
  website: String,
  fblink: String,
  organic: Boolean,
  conservative: Boolean,
  stand: [{
    open: Boolean,
    name: String,
    descript: String,
    location: {
      street: String,
      city: String,
      state: String,
      zip: Number,
      lat: Number,
      lon: Number},
    products: {
      veg:[String],
      fruit:[String],
      flower:[String],
      meat:[String],
      comm:[String]},
  }]
});

FarmerSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

FarmerSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

FarmerSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = mongoose.model('farmer', FarmerSchema,'farmer');