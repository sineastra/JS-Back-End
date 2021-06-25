const Hotel = require('../models/Hotel.js')

module.exports = {
	getAll: async () => await Hotel.find({}).lean(),
	create: async (record) => {
		await new Hotel(record).save()
	},
	getById: async (_id) => Hotel.findOne({ _id: _id }).lean(),
	update: async (_id, updated) => Hotel.findByIdAndUpdate(_id, updated),
	deleteById: async (_id) => Hotel.findByIdAndDelete(_id)
}