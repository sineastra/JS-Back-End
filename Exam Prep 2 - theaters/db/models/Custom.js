const mongoose = require('mongoose')

const CustomSchema = new mongoose.Schema({
	title: { type: String, unique: true },
	description: { type: String, required: true, maxLength: 50 },
	imageUrl: { type: String, required: true },
	isPublic: { type: Boolean, default: false },
	createdAt: { type: Date, required: true },
	usersLiked: [{ type: 'ObjectID', ref: 'User' }],
	owner: { type: 'ObjectID', required: true },
})

const Custom = mongoose.model('Play', CustomSchema)

module.exports = Custom