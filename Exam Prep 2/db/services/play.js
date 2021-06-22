const Play = require('../models/Play')

// check if these are good.
module.exports = {
	getAll: async () => await Play.find({ isPublic: true }).lean(),
	getFirstNbyLikesDesc: async (n) =>
		await Play.find({ isPublic: true }).sort({ 'usersLiked': -1 }).slice('usersLiked', n).lean(),
	create: async (play) => await new Play(play).save(),
	getById: async (id) => await Play.findById(id).lean(),
	likeById: async (id, userId) => {
		const play = await Play.findById(id)

		play.usersLiked.push(userId)
		play.save()
	},
	deleteById: async (id) => await Play.findByIdAndDelete(id),
	updateById: async (id, updated) => await Play.findByIdAndUpdate(id, updated),
	getFirstNByDateDesc: async (n) =>
		await Play.find({ isPublic: true }).sort({ 'createdAt': -1 }).slice('createdAt', n).lean(),
}