const router = require('express').Router()
const { auth } = require('../strategies/local')
const { User } = require('../models')

// List users
router.get('/users', auth, async (req, res, next) => {
  const query = req.query || {}
  let results = await User.find(query).catch(next)
  if (!results) { return res.status(500).json({ error: { message: 'An error occured while searching for users' } }) }
  results = results.map(i => new User(i))
  return res.status(200).json({ data: results })
})

// Get user(s) by id
router.get('/users/:id', auth, async (req, res, next) => {
  const user = await User.findById(req.params.id).catch(next)
  if (!user) { return res.sendStatus(404) }
  return res.json({ data: user })
})

module.exports = router
