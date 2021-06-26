const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	hashedPassword: { type: String, required: true },
	enrolledCourses: [{ type: 'ObjectId', ref: 'Course' }],
})

const User = mongoose.model('User', UserSchema)

module.exports = User