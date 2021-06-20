const user = require('../db/services/user.js')
const hotel = require('../db/services/hotel.js')

module.exports = (req, res, next) => {
	req.dbServices = {
		user,
		hotel,
	}

	next()
}