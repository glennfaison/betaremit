const router = require('express').Router()
const { auth } = require('../strategies/local')
const { User } = require('../models')
const HttpStatus = require('http-status-codes')

// List users
router.get('/users', auth, async (req, res, next) => {
  const query = req.query || {}
  let results = await User.find(query).catch(next)
  if (!results) { return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: { message: 'An error occured while searching for users' } }) }
  results = results.map(i => new User(i))
  return res.status(HttpStatus.OK).json({ data: results })
})

// Get user(s) by id
router.get('/users/:id', auth, async (req, res, next) => {
  const user = await User.findById(req.params.id).catch(next)
  if (!user) { return res.sendStatus(HttpStatus.NOT_FOUND) }
  return res.status(HttpStatus.OK).json({ data: user })
})

module.exports = router
