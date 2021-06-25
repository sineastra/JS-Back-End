const { checkValidInput } = require('../util/utilities')
const bcrypt = require('bcrypt')

module.exports = {
	get: (req, res) => res.render('register'),
	post: async (req, res) => {
		const user = await req.dbController.getUserByName(req.body.username)

		if (user === null) {
			const validInfo = checkValidInput(req.body) && req.body.password === req.body.repass

			if (validInfo) {
				await req.dbController.createUser({
					username: req.body.username,
					hashedPassword: await bcrypt.hash(req.body.password, 8),
				})
				res.redirect('/')
				return
			}
		}

		res.redirect('/register')
	}
}