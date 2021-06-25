const Custom = require("../models/Custom")

// check if these are good.
module.exports = {
	getAll: async () => await Custom.find({}).lean(),
	create: async entry => await new Custom(entry).save(),
	getById: async id => await Custom.findById(id).lean(),
	deleteById: async id => await Custom.findByIdAndDelete(id),
	updateById: async (id, updated) => await Custom.findByIdAndUpdate(id, updated, { runValidators: true }),
	buy: async (userId, itemId) => {
		const item = await Custom.findById(itemId)

		item.buyers.push(userId)

		await item.save()
	},
	getAllSortedBuyers: async (type) =>
		await Custom.find({}).sort({ 'buyers': type }).lean(),
}
