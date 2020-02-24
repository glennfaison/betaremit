const createServer = require('./src/server')
const config = require('./config')
const mongoose = require('mongoose')
const { loadProductsFromJsonFile } = require('./preload')

// Create the server
const server = createServer()

// Start the server
server.listen(config.port, () => {
  console.log(`Listening on port http://localhost:${config.port} in ${config.env} mode`)

  // Connect to mongodb
  mongoose.connect(config.mongoUrl, { useNewUrlParser: true }).then((connection) => {
    if (config.env === 'development') {
      connection.set('debug', true)
    }
    // Preload products from JSON file if they are not in the database
    loadProductsFromJsonFile(connection, './preload/Products.json')
  }).catch((err) => {
    // If we're here, we failed to connect to the DB
    console.log('Could not establish a connection to the database!')
    console.log(err)
    process.exit(1)
  })
})

// Catch any uncaught exceptions in this application
process.on('uncaughtException', (err) => {
  console.log(`There was an uncaught exception: ${err}`)
})

// Catch any unhandled rejections in this application
process.on('unhandledRejection', (err) => {
  console.log(`There was an unhandled rejection: ${err}`)
})
