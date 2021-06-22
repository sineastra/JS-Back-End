const mongoose = require('mongoose')

// UPDATE THE SCHEMA
const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	hashedPassword: { type: String, required: true },
	likedPlays: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Play' }],
})

const User = mongoose.model('User', UserSchema)

module.exports = User