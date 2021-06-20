const User = require('../models/User.js')

module.exports = {
	createNew: async (userData) =>
		await new User(userData).save(),

	getByUsername: async (username) =>
		await User.findOne({ username }).lean(),

	getByEmail: async (email) =>
		await User.findOne({ email }).lean(),
}