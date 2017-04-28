const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('../config');

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

// use strategy w/passport
passport.use(jwtLogin);
