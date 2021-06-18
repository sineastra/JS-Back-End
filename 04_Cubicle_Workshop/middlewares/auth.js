const jwt = require('jsonwebtoken')
const { tokenSecret, cookieName } = require('../environments/variables')

const processToken = (req, res, next) => {
	const token = req.cookies[cookieName]

	if (token) {
		try {
			const userData = jwt.verify(token, tokenSecret)
			req.user = userData
			res.locals.user = userData
		} catch (e) {
			res.clearCookie(cookieName)
			res.redirect('/login')

			return false
		}
	}
	next()
}

module.exports = processToken
