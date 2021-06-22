const Play = require('../models/Play')

// check if these are good.
module.exports = {
	getAll: async () => await Play.find({ isPublic: true }).lean(),
	getFirst3Descending: async () =>
		await Play.find({ isPublic: true }).sort({ 'usersLiked': -1 }).slice('usersLiked', 3).lean(),
	create: async (play) => await new Play(play).save(),
	getById: async (id) => await Play.findById(id).lean(),
}