const express = require('express')

const NodesService = require('../services/nodes')

function nodesApi(app) {
	const router = express.Router()
	app.use('/api/nodes', router)

	const nodesService = new NodesService()

	router.get('/', async function (req, res, next) {
		try {
			const nodes = await nodesService.getNodes()
			res.status(200).json({
				data: nodes,
				message: 'Nodes listed'
			})
		} catch (error) {
			next(error)
		}
	})
}

module.exports = nodesApi