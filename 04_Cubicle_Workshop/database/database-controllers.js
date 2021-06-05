const mongoose = require('mongoose')
const Cube = require('./models/Cube.js')
const Accessory = require('./models/Accessory.js')

const dbInit = async () => {
	try {
		await mongoose.connect('mongodb://localhost:27017/cubicle', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		console.log('Database Connected')
	} catch (e) {
		console.log(`Problem with DB initialization. -> ${e}`)
	}

	return (req, res, next) => {
		req.dbController = {
			insertCube,
			insertAccessory,
			getAllCubes,
			getCubeById,
			filterByFieldValues,
		}
		next()
	}
}

const getAllCubes = async () => await Cube.find({})

const filterByFieldValues = async (queryParams) => {
	const mappedData = Object.entries(queryParams).reduce((a, [key, value]) => {
		if (key !== 'from' && key !== 'to' && value !== '' && value !== undefined) {
			a[key] = new RegExp(`${value}`, 'i')
		}

		return a
	}, {})

	const searchCriteria = {
		'difficultyLevel': {
			$gte: Number(queryParams.from) || 1,
			$lte: Number(queryParams.to) || 6
		},
		...mappedData
	}

	const result = await Cube.find(searchCriteria)

	return result
}


const getCubeById = async id => {
	try {
		return Cube.findOne({ _id: id })
	} catch (e) {
		console.log(`Error while trying to get item from Database -> ${e}`)
	}
}

const insert = async (model, entry) => {
	try {
		await new model(entry).save()
	} catch (e) {
		console.log(`Error - ${e} while trying to write to the Database`)
	}
}

const insertAccessory = async (entry) => insert(Accessory, entry)
const insertCube = async entry => insert(Cube, entry)

module.exports = {
	dbInit,
	insertCube,
	insertAccessory,
	getAllCubes,
	getCubeById,
	filterByFieldValues,
}
