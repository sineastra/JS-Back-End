const user = require('../db/services/user')
const play = require('../db/services/play')

// include all the services,
module.exports = (req, res, next) => {
	req.dbServices = {
		user,
		play,
	}

	next()
}