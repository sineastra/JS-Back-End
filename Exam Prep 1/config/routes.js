const home = require('../controllers/home.js')
const hotel = require('../controllers/hotel.js')

// associate routes with the controllers (modular routers)

module.exports = (app) => {
	app.use('/', home)
	app.use('/hotel', hotel)
}