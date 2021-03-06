const passport = require('passport');

const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

// use tokens for protected routes, not session/cookie
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'get request to root route.' });
  });

  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
