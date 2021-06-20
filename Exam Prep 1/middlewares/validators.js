const { isEmail } = require('validator')

module.exports = (req, res, next) => {
	req.validators = { isEmail }
	next()
}