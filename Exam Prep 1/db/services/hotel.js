const Hotel = require('../models/Hotel.js')

module.exports = {
	getAll: async () => await Hotel.find({}).lean(),
	writeOne: async (record) => {
		await new Hotel(record).save()
	},
	getOneById: async (_id) => Hotel.findOne({ _id: _id }).lean()
}