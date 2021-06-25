const mongoose = require('mongoose')

// change the connect string ->

module.exports = (app) => new Promise((resolve, reject) => {
	mongoose.connect('mongodb://localhost:27017/theater', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		autoIndex: false,
	})

	const db = mongoose.connection

	db.on('error', err => {
		console.log(`Database error: ${err.message}`)
		reject(err.message)
	})
	db.on('open', () => {
		console.log(`Database connected`)
		resolve()
	})
})