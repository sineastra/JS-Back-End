const express = require('express')
const appConfig = require('./config/app.js')

const start = async () => {
	const port = 3000
	const app = express()

	await appConfig(app)

	app.listen(port, () => console.log(`Server listening on port ${port}`))
}

start()