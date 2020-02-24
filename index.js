const createServer = require('./src/server')

// Create the server
const server = createServer()

server.listen(3000, () => {
  console.log(`The application is listening on port http://localhost:${3000}`)
})

process.on('uncaughtException', (err) => {
  console.log(`There was an uncaught exception: ${err}`)
})

process.on('unhandledRejection', (err) => {
  console.log(`There was an unhandled rejection: ${err}`)
})
