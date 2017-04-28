const jwt = require('jwt-simple');

const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // conventionally, jwt's have sub(ject) & iat (issued-at-time) properties
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // user has had email & pw auth'd
  // but we need to assign a token
  // when passport calls done w/user, it's assigned to req.user:
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({error: "Please provide an email & password."});
  }

  // validate email uniqueness (if existingUser is null):
  User.findOne({
    email: email
  }, function(err, existingUser) {
    // if e.g. db connection or search fails:
    if (err) {
      return next(err);
    }

    // if a user w/same email exists, return error:
    if (existingUser) {
      return res.status(422).send({error: "Email is already in use."});
    }

    // if user w/email doesn't exist, create & save user record:
    const user = new User({email: email, password: password})

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      // respond to req assigning token to user:
      res.json({ token: tokenForUser(user) });
    });
  });
}
