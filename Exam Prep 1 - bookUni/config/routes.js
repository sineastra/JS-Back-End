const homeController = require('../controllers/home.js')
const hotelController = require('../controllers/hotel.js')
const userController = require('../controllers/user.js')

// associate routes with the controllers (modular routers)

module.exports = (app) => {
	app.use('/', homeController)
	app.use('/hotel', hotelController)
	app.use('/user', userController)
}