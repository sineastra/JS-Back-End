const home = require('../controllers/home.js')
const hotel = require('../controllers/hotel.js')
const user = require('../controllers/user.js')

// associate routes with the controllers (modular routers)

module.exports = (app) => {
	app.use('/', home)
	app.use('/hotel', hotel)
	app.use('/user', user)
}