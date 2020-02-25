const { Strategy: LocalStrategy } = require('passport-local')
const { User } = require('../models')
const { jwtSecret } = require('../../config')
const expressJwt = require('express-jwt')

// Passport.js local authentication strategy (username and password auth)
const localStrategy = new LocalStrategy(
  { usernameField: 'user[email]', passwordField: 'user[password]' },
  (email, password, done) => {
    User.findOne({ email }).then((user) => {
      if (!user || !user.passwordIsValid(password)) {
        return done(null, false, { error: { 'email and/or password': 'is incorrect' } })
      }
      return done(null, user)
    }).catch(done)
  })

function getTokenFromHeader (req) {
  return req.headers.authorization && req.headers.authorization.match(/Bearer (.+)/)[1]
}

localStrategy.auth = expressJwt({
  secret: jwtSecret,
  userProperty: 'auth',
  getToken: getTokenFromHeader
})

module.exports = localStrategy
