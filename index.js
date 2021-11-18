const express = require('express')
const cors = require('cors')

const { config } = require('./config')
const { logErrors, wrapErrors, errorHandler } = require('./utils/middlewares/errorsHandlers')

const measurementApi = require('./routes/measurement')
const nodesApi = require('./routes/nodes')

const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// routes
measurementApi(app)
nodesApi(app)

// errorHandlers
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

// init server
const server = app.listen(config.port, function () {
	console.log(`Listening on http://localhost:${server.address().port}`)
})