const jwt = require('jsonwebtoken')
const { TOKEN_SECRET, COOKIE_NAME } = require('../config/variables.js')

const processAuth = (req, res, next) => {
	const token = req.cookies[COOKIE_NAME]

	if (token) {
		try {
			const userData = jwt.verify(token, TOKEN_SECRET)
			req.user = userData
			res.locals.user = userData
		} catch (e) {
			res.clearCookie(COOKIE_NAME)
			res.redirect('/login')

			return false
		}
	}
	next()
}

module.exports = processAuth