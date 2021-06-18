const jwt = require('jsonwebtoken')
const { tokenSecret, cookieName } = require('../environments/variables')

const processToken = (req, res, next) => {
	const token = req.cookies[cookieName]

	if (token) {
		try {
			req.user = jwt.verify(token, tokenSecret)
		} catch (e) {
			res.clearCookie(cookieName)
			res.redirect('/login')

			return false
		}
	}
	next()
}

module.exports = processToken
