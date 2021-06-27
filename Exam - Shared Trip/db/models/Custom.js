const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
	startPoint: { type: String, required: true },
	endPoint: { type: String, required: true },
	date: { type: String, required: true },
	time: { type: String, required: true },
	carImage: { type: String, required: true },
	carBrand: { type: String, required: true },
	seats: { type: Number, required: true },
	price: { type: Number, required: true },
	description: { type: String, required: true },
	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})

// CHANGE THE NAME
const Custom = mongoose.model("Trip", CustomSchema)

module.exports = Custom
