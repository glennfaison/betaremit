const router = require('express').Router()

router.use('/', require('./users'))
router.use('/', require('./products'))
router.use('/auth', require('./auth'))

module.exports = router
