const router = require('express').Router()
const { auth } = require('../strategies/local')
const { Product } = require('../models')
const ObjectId = require('mongoose').Types.ObjectId

// Create Products
router.post('/products', auth, async (req, res, next) => {
  const { id, _id, ...otherKeys } = req.body.product
  const product = new Product(otherKeys)

  const result = await product.save().catch(next)
  return res.status(201).json({ data: result })
})

// List products
router.get('/products', auth, async (req, res, next) => {
  const query = req.query || {}
  let results = await Product.find(query).catch(next)
  if (!results) { return res.status(500).json({ error: { message: 'An error occured while searching for products' } }) }
  results = results.map(i => new Product(i))
  return res.status(200).json({ data: results })
})

// Get product(s) by id
router.get('/products/:id', auth, async (req, res, next) => {
  const product = await Product.findById(req.params.id).catch(next)
  if (!product) { return res.sendStatus(404) }
  return res.json({ data: product })
})

// Delete product by id
router.delete('/products/:id', auth, async (req, res, next) => {
  const result = await Product.deleteOne({ _id: new ObjectId(req.params.id) }).catch(next)
  return res.sendStatus(200).json(result)
})

module.exports = router
