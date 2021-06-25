const Custom = require('../models/Custom')

// check if these are good.
module.exports = {
	getAll: async () => await Custom.find({ isPublic: true }).lean(),
	getFirstNbyLikesDesc: async (n) =>
		await Custom.find({ isPublic: true }).sort({ 'usersLiked': -1 }).slice('usersLiked', n).lean(),
	create: async (play) => await new Custom(play).save(),
	getById: async (id) => await Custom.findById(id).lean(),
	likeById: async (id, userId) => {
		const play = await Custom.findById(id)

		play.usersLiked.push(userId)
		play.save()
	},
	deleteById: async (id) => await Custom.findByIdAndDelete(id),
	updateById: async (id, updated) => await Custom.findByIdAndUpdate(id, updated),
	getFirstNByDateDesc: async (n) =>
		await Custom.find({ isPublic: true }).sort({ 'createdAt': -1 }).slice('createdAt', n).lean(),
}