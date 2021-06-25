const User = require('../models/User.js')

// check if these are good.
module.exports = {
	createNew: async (userData) =>
		await new User(userData).save(),

	getByEmail: async (email) =>
		await User.findOne({ email }).lean(),

	buy: async (userId, itemId) => {
		const user = await User.findById(userId)

		user.offersBought.push(itemId)

		await user.save()
	},

	update: async (_id, updated) =>
		await User.findByIdAndUpdate(_id, updated),

	getByIdPopulated: async (_id) =>
		await User.findById(_id).populate('offersBought').lean(),
}