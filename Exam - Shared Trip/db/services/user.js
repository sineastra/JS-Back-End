const User = require('../models/User.js')

// check if these are good.
module.exports = {
	createNew: async (userData) =>
		await new User(userData).save(),

	getByEmail: async (email) =>
		await User.findOne({ email }).lean(),

	update: async (_id, updated) =>
		await User.findByIdAndUpdate(_id, updated),

	getById: async (_id) =>
		await User.findById(_id).populate('tripsHistory').lean(),

	addTrip: async (tripId, userId) => {
		const user = await User.findOne({ _id: userId })
		console.log(user)
		user.tripsHistory.push(tripId)

		user.save()
	},
}