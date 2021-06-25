const userController = require('../controllers/user.js')
const homeController = require('../controllers/home')
const playController = require('../controllers/play')

// associate routes with the controllers (modular routers)
module.exports = (app) => {
	app.use('/', homeController)
	app.use('/play', playController)
	app.use('/user', userController)
}
