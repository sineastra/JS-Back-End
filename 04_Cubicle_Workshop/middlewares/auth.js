const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { tokenName, cookieName } = require('../environments/variables')

const processToken = (req, res, next) => {
	const token = req.cookies[cookieName]

	if (token) {
		try {
			req.user = jwt.verify(token, tokenName)
		} catch (e) {
			res.clearCookie(cookieName)
			res.redirect('/login')

			return false
		}
	}
	next()
}

const login = async (req, res, next) => {

}

module.exports = {
	processToken,
	loginMw: login,
}