const MongoLib = require('../lib/mongo')

class MeasurementService {
	constructor() {
		this.mongoDB = new MongoLib()
		this.collection = 'measurements'
	}

	async getMeasurements({ nodo }) {
		const measurements = await this.mongoDB.getAll(this.collection, { nodo })

		return measurements || []
	}

	async createMeasurement({ measurement }) {
		const newMeasurement = {...measurement, fecha: new Date()}
		const measurementId = await this.mongoDB.create(this.collection, newMeasurement)
		const data = await this.mongoDB.getReport(this.collection, measurement.nodo)
		const elements = await data.toArray()
		elements.forEach(element => {
			this.createAlertIntRuido(element.avg_int_ruido, measurement.nodo, 'Intensidad de ruido')
			this.createAlertTimAltura(element.avg_tim_altura, measurement.nodo, 'Timbre y altura')
		});

		return measurementId
	}

	async getAlerts() {
		const collection = 'alerts'
		console.log(collection)
		const alerts = await this.mongoDB.getAll(collection, {})
		
		return alerts || []
	}

	async createAlertIntRuido(valor, nodo, variable) {
		const collection = 'alerts'
		const alert = {
			nodo,
			variable,
			valor,
			fecha: new Date()
		}
		if (valor >= 70 && valor < 85) {
			await this.mongoDB.create(collection, { ...alert, tipo: 'Advertencia' })
		} else if (valor >= 85) {
			await this.mongoDB.create(collection, { ...alert, tipo: 'Alerta regulación' })
		}
	}

	async createAlertTimAltura(valor, nodo, variable) {
		const collection = 'alerts'
		const alert = {
			nodo,
			variable,
			valor,
			fecha: new Date()
		}
		if (valor >= 450 && valor < 650) {
			await this.mongoDB.create(collection, { ...alert, tipo: 'Advertencia' })
		} else if (valor >= 650) {
			await this.mongoDB.create(collection, { ...alert, tipo: 'Alerta regulación' })
		}
	}
}

module.exports = MeasurementService