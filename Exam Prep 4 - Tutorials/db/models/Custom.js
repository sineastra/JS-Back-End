const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	description: { type: String, required: true, maxlength: 50 },
	imageUrl: { type: String, required: true },
	duration: { type: String, required: true },
	createdAt: { type: Date, required: true },
	usersEnrolled: [{ type: 'ObjectId', ref: 'User' }],
	owner: { type: 'ObjectId', ref: 'User' },
})

const Custom = mongoose.model("Courses", CustomSchema)

module.exports = Custom
