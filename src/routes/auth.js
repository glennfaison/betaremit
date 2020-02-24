const router = require('express').Router()
const passport = require('passport')
const { User } = require('../models')

// Registration
router.post('/register', async (req, res, next) => {
  const { password, ...otherKeys } = req.body.user
  const user = new User(otherKeys)

  user.setPassword(password)

  const result = await user.save().catch(next)
  return res.status(201).json({ data: result })
})

// Login
router.put('/login', async (req, res, next) => {
  const { email, password } = req.body.user
  if (!email) {
    return res.status(422).json({ errors: { email: 'is required!' } })
  }
  if (!password) {
    return res.status(422).json({ errors: { password: 'is required!' } })
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(422).json(info) }
    return res.json({ data: user.toAuthJSON() })
  })(req, res, next)
})

module.exports = router
