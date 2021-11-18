const express = require('express')

const MeasurementService = require('../services/measurement')

function measurementApi(app) {
	const router = express.Router()
	app.use('/api/measurement', router)

	const measurementService = new MeasurementService()

	router.get('/', async function (req, res, next) {
		res.status(200).json({
			status: 'success'
		})
	})

	router.get('/:nodo', async function(req, res, next) {
		const { nodo } = req.params
		try {
			const measurementsNodo = await measurementService.getMeasurements({ nodo })
			res.status(200).json({
				data: measurementsNodo,
				message: `Measurements listed by nodo => ${nodo}`
			})
		} catch (error) {
			next(error)
		}
	})

	router.get('/alerts/:nodo', async function(req, res, next) {
		const { nodo } = req.params
		try {
			const alertsNodo = await measurementService.getAlerts({ nodo })
			res.status(200).json({
				data: alertsNodo,
				message: `Alerts listed by nodo => ${nodo}`
			})
		} catch (error) {
			next(error)
		}
	})

	router.post('/', async function(req, res, next) {
		const { body: measurement } = req
		try {
			const createdMeasurementId = await measurementService.createMeasurement({ measurement })
			console.log("Medición guardada");
			res.status(201).json({
				data: createdMeasurementId,
				message: 'Measurement created'
			})
		} catch (error) {
			next(error)
		}
	})
}

module.exports = measurementApi