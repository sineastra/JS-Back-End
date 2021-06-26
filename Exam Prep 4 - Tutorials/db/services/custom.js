const Custom = require("../models/Custom")

module.exports = {
	getAll: async () => await Custom.find({}).lean(),
	create: async entry => await new Custom(entry).save(),
	getById: async id => await Custom.findById(id).lean(),
	deleteById: async id => await Custom.findByIdAndDelete(id),
	updateById: async (id, updated) =>
		await Custom.findByIdAndUpdate(id, updated, { runValidators: true }),
	getAllSortedByCreateTime: async (type) =>
		await Custom.find({}).sort({ createdAt: type }).lean(),
	getTopNSortedByEnrolled: async (type, n) =>
		await Custom.find({}).sort({ usersEnrolled: type }).slice('Courses', n).lean(),
	enroll: async (customId, userId) => {
		const custom = await Custom.findById(customId)

		custom.usersEnrolled.push(userId)

		custom.save()
	},
}
