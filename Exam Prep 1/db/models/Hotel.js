const mongoose = require('mongoose')

const HotelSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	city: { type: String, required: true },
	imageUrl: { type: String, required: true },
	freeRooms: { type: Number, min: 1, max: 100 },
	usersWhoBookedRoom: Array,
	owner: { type: String, required: true }
})

const Hotel = mongoose.model('Hotel', HotelSchema)

module.exports = Hotel