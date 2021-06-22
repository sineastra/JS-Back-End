const user = require('../db/services/user')
const play = require('../db/services/play')

// include all the services, which are in db/services, which use
module.exports = (req, res, next) => {
	req.dbServices = {
		user,
		play,
	}

	next()
}