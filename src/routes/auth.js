const router = require('express').Router()
const passport = require('passport')
const { User } = require('../models')
const HttpStatus = require('http-status-codes')

// Registration
router.post('/register', async (req, res, next) => {
  const { password, ...otherKeys } = req.body.user
  const user = new User(otherKeys)

  user.setPassword(password)

  let result
  try {
    result = await user.save()
  } catch (e) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: e })
  }
  return res.status(HttpStatus.CREATED).json({ data: result })
})

// Login
router.put('/login', async (req, res, next) => {
  const { email, password } = req.body.user
  if (!email) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: { email: 'is required!' } })
  }
  if (!password) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: { password: 'is required!' } })
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(HttpStatus.BAD_REQUEST).json({ error: info }) }
    return res.status(HttpStatus.OK).json({ data: user.toAuthJSON() })
  })(req, res, next)
})

module.exports = router
