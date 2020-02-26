const router = require('express').Router()
const { auth } = require('../strategies/local')
const { Product } = require('../models')
const HttpStatus = require('http-status-codes')

// Create Products
router.post('/products', auth, async (req, res, next) => {
  const { id, _id, ...otherKeys } = req.body.product
  const product = new Product(otherKeys)

  const result = await product.save().catch(next)
  return res.status(HttpStatus.CREATED).json({ data: result })
})

// List products
router.get('/products', auth, async (req, res, next) => {
  const query = req.query || {}
  let results = await Product.find(query).catch(next)
  if (!results) { return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: { message: 'An error occured while searching for products' } }) }
  results = results.map(i => new Product(i))
  return res.status(HttpStatus.OK).json({ data: results })
})

// Get product(s) by id
router.get('/products/:id', auth, async (req, res, next) => {
  if (req.params.id === undefined) {
    return res.sendStatus(HttpStatus.BAD_REQUEST)
  }
  const product = await Product.findById(req.params.id).catch(next)
  if (!product) { return res.sendStatus(HttpStatus.NOT_FOUND) }
  return res.status(HttpStatus.OK).json({ data: product })
})

// Modify product(s) by id
router.put('/products/:id', auth, async (req, res, next) => {
  const { _id, id, ...otherKeys } = req.body.product
  await Product.findOneAndUpdate({ _id: req.params.id }, otherKeys).catch(next)
  const product = await Product.findById(req.params.id).catch(next)
  if (!product) { return res.sendStatus(HttpStatus.NOT_MODIFIED) }
  return res.status(HttpStatus.OK).json({ data: product })
})

// Delete product by id
router.delete('/products/:id', auth, async (req, res, next) => {
  const result = await Product.deleteOne({ _id: req.params.id }).catch(next)
  if (result.deletedCount < 1) { return res.sendStatus(HttpStatus.NOT_MODIFIED) }
  return res.status(HttpStatus.OK).json({ data: result })
})

module.exports = router
