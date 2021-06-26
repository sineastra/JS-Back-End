const mongoose = require('mongoose')

// UPDATE THE SCHEMA
const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	hashedPassword: { type: String, required: true },
})

const User = mongoose.model('User', UserSchema)

module.exports = User