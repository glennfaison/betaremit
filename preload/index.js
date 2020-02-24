const mongoose = require('mongoose')
const _path = require('path')
const _fs = require('fs')

async function loadProductsFromJsonFile (connection = mongoose, filepath = '') {
  if (!filepath || !connection) { return }
  filepath = _path.resolve(filepath)

  // Get the products from the file
  let json
  try {
    // Block the thread and prevent further execution of the server while this is running
    json = _fs.readFileSync(filepath, { encoding: 'utf-8', flag: 'r' })
  } catch (e) {
    console.log(`Failed to read file: ${filepath}`)
    console.log(e)
    return
  }
  let products = JSON.parse(json)
  products = products.map(product => {
    const { _id, ...otherProps } = product
    return otherProps
  })

  // Check if the products exist in the MongoDB instance, and insert if they do not
  const Product = connection.models.Product

  // Insert products with no matches in current DB instance
  products.forEach(async product => {
    const match = await Product.findOne(product)
    if (match) { return }
    await Product.create(product).catch(err => {
      console.log(`Failed to insert product: ${product}`)
      console.log(err)
    })
  })
}

module.exports = {
  loadProductsFromJsonFile
}
