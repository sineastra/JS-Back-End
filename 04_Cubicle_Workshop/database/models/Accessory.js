const mongoose = require('mongoose')

const accessorySchema = new mongoose.Schema({
	name: { type: String, required: true },
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
	description: { type: String, required: true, maxLength: 20 },
	cubes: { type: mongoose.Schema.Types.ObjectId, ref: 'Cube' },
})

const Accessory = mongoose.model('Accessory', accessorySchema)

module.exports = Accessory
