const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	price: { type: Number, required: true, min: 0 },
	imageUrl: { type: String, required: true },
	brand: String,
	createdAt: Date,
	buyers: [{ type: 'ObjectId', ref: 'User' }],
	owner: 'ObjectId',
})

// CHANGE THE NAME
const Custom = mongoose.model("Offer", CustomSchema)

module.exports = Custom
