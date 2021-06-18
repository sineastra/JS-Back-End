const mongoose = require('mongoose')

const cubeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true, maxLength: 20 },
	imageUrl: {
		type: String,
		required: true,
		validator: () => ({
			message: 'Must be a valid URL',
			protocols: ['http', 'https'],
			require_tld: true,
			require_protocol: true,
		}),
	},
	difficultyLevel: { type: Number, required: true, min: 1, max: 6 },
	accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accessory' }],
	creatorId: { type: String, required: true, unique: true }
})

const Cube = mongoose.model('Cube', cubeSchema)

module.exports = Cube
