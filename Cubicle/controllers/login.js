const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { checkValidInput } = require('../util/utilities')
const { tokenSecret, cookieName } = require('../environments/variables')

module.exports = {
	get: async (req, res) => {
		res.render('login')
	},
	post: async (req, res) => {
		const user = await req.dbController.getUserByName(req.body.username)

		if (checkValidInput(req.body) === false
			|| user === null
			|| bcrypt.compare(req.body.password, user.hashedPassword) === false) {

			res.redirect('/login')
			return
		}

		const token = jwt.sign({
			username: user.username,
			_id: user._id
		}, tokenSecret)
		res.cookie(cookieName, token, { httpOnly: true })
		res.redirect('/')
	}
}