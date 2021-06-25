const dbConfig = require('../config/database.js')
const expressConfig = require('../config/express.js')
const routesConfig = require('../config/routes.js')
const dbServices = require('../middlewares/dbServices.js')

module.exports = async (app) => {
	try {
		await dbConfig(app)
		expressConfig(app)

		app.use(dbServices)

		routesConfig(app)

	} catch (e) {
		console.log(`Error while trying to use middleware. Go to config/app.js for all middlewares. 
Message: ${e.message}`)
	}
}