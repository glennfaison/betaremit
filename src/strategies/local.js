const { Strategy: LocalStrategy } = require('passport-local')
const User = require('../models/user')

// Passport.js local authentication strategy (username and password auth)
const localStrategy = new LocalStrategy(
  { usernameField: 'user[email]', passwordField: 'user[password]' },
  (email, password, done) => {
    User.findOne({ email }).then((user) => {
      if (!user || !user.passwordIsValid(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } })
      }
      return done(null, user)
    }).catch(done)
  })

module.exports = localStrategy
