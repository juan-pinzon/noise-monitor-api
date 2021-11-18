const { MongoClient, ObjectId } = require('mongodb')
const debug = require('debug')('app:mongo')
const { config } = require('../config')

const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)
const DB_NAME = encodeURIComponent(config.dbName)

//const MONGO_URI = `mongodb://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/?retryWrites=true&w=majority`
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.hw1ns.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true,  useUnifiedTopology: true })
    this.dbName = DB_NAME
  }

	connect() {
		if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err)
          }
          resolve(this.client.db(this.dbName))
					debug('Connected succesfully to Mongo')
        })
      })
    }

    return MongoLib.connection
	}

	getAll(collection, query) {
    return this.connect().then((db) => {
      return db.collection(collection).find(query).toArray()
    })
  }

  get(collection, id) {
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ _id: ObjectId(id) })
    })
  }

	getReport(collection, nodo) {
		return this.connect().then(db => {
			return db.collection(collection).aggregate([
				{$match: { nodo }},
				{$group: { _id: "$nodo", avg_int_ruido: { $avg: "$int_ruido" }, avg_tim_altura: { $avg: "$tim_altura" } }},
				{ $sort: { fecha: -1 } },
				{ $limit: 6 }
			])
		})
	}

  create(collection, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).insertOne(data)
      })
      .then((result) => result.insertedId)
  }

  update(collection, id, data) {
    return this.connect()
      .then((db) => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true })
      })
      .then((result) => result.upsertedId || id)
  }

  delete(collection, id) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) })
      })
      .then(() => id)
  }
}

module.exports = MongoLib