const passport = require('passport');

const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

// use tokens for protected routes, not session/cookie
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });

  app.post('/signup', Authentication.signup);
}
