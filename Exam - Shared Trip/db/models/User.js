const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	hashedPassword: { type: String, required: true },
	gender: { type: String, required: true },
	tripsHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
})

const User = mongoose.model('User', UserSchema)

module.exports = User