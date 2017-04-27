const User = require('../models/user');

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

      // respond to req indicating user was created:
      res.json({success: true});
    });
  });
}
