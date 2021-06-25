const { cookieName } = require('../environments/variables')

module.exports = (req, res) => {
	res.clearCookie(cookieName)
	res.redirect('/')
}