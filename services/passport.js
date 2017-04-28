const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('../config');

// create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // verify username and password
  // call done w/user if username & password correct
  // otherwise, call done w/false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare 'password' === user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});


// setup options for JWT strategy
const jwtOptions = {
  // look for token in the authorization header:
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // ...and decode with our secret string:
  secretOrKey: config.secret
};

// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // does userId & payload exist in db?
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    // if so, call 'done' w/user (authenticated)
    if (user) {
      done(null, user);
    // if not, call 'done' w/o user obj
    } else {
      done(null, false);
    }
  });
});

// use strategies w/passport
passport.use(jwtLogin);
passport.use(localLogin);
