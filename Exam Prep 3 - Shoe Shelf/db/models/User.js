const mongoose = require('mongoose')

// UPDATE THE SCHEMA
const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	fullName: String,
	hashedPassword: { type: String, required: true },
	offersBought: [{ type: 'ObjectId', ref: 'Offer' }],
})

const User = mongoose.model('User', UserSchema)

module.exports = User