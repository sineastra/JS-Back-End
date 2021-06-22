const User = require('../models/User.js')

module.exports = {
	createNew: async (userData) =>
		await new User(userData).save(),

	getByUsername: async (username) =>
		await User.findOne({ username }).lean(),

	update: async (_id, updated) =>
		await User.findByIdAndUpdate(_id, updated),

	getById: async (_id) =>
		await User.findById({ _id }).populate('bookedHotels').lean(),
}