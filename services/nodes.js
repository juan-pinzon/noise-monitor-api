const MongoLib = require('../lib/mongo')

class NodesService {
	constructor() {
		this.mongoDB = new MongoLib()
		this.collection = 'nodes'
	}

	async getNodes() {
		const nodes = await this.mongoDB.getAll(this.collection)

		return nodes || []
	}
}

module.exports = NodesService