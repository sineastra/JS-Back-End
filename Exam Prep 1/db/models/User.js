const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	hashedPassword: { type: String, required: true },
	bookedHotels: [{ type: 'ObjectId', ref: 'Hotel' }],
	offeredHotels: Array,
})

const User = mongoose.model('User', UserSchema)

module.exports = User