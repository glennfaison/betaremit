const createServer = require('./src/server')
const config = require('./config')

// Create the server
const server = createServer()

// Start the server
server.listen(config.port, () => {
  console.log(`Listening on port http://localhost:${config.port} in ${config.env} mode`)
})

// Catch any uncaught exceptions in this application
process.on('uncaughtException', (err) => {
  console.log(`There was an uncaught exception: ${err}`)
})

// Catch any unhandled rejections in this application
process.on('unhandledRejection', (err) => {
  console.log(`There was an unhandled rejection: ${err}`)
})
