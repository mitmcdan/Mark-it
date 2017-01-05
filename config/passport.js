var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Farmer = require('../app/models/farmer.server.model');
//var Admin = mongoose.model('Admin');


passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    Farmer.findOne({ email: username }, function (err, farmer) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!farmer) {
        console.log("user not found");
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!farmer.validPassword(password)) {
        console.log("password is wrong");
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      console.log("correct in passport.js");
      return done(null, farmer);
    });
  }
));

