const mongoose = require('mongoose')
const Cube = require('./models/Cube')
const Accessory = require('./models/Accessory')
const User = require('./models/User')

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
			getAvailableAccessories,
			getAccessoryById,
			getAllCubes,
			getCubeById,
			filterByFieldValues,
			getUserByName,
			createUser,
			updateCube,
		}

		next()
	}
}

const getUserByName = async (name) => await User.findOne({ username: name })

const getAllCubes = async () => await Cube.find({})

const updateCube = async (_id, newCube) =>
	await Cube.findByIdAndUpdate(_id, newCube)

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

const getAvailableAccessories = async (_id) =>
	await Accessory.find({}).where('cubes').nin([_id])

const insert = async (model, entry) => {
	try {
		await new model(entry).save()
	} catch (e) {
		console.log(`Error - ${e} while trying to write to the Database`)
	}
}

const getById = async (model, id) => {
	try {
		return model.findOne({ _id: id })
	} catch (e) {
		console.log(`Error while trying to get item from Database -> ${e}`)
	}
}

const getCubeById = async id => getById(Cube, id)
const getAccessoryById = async id => getById(Accessory, id)

const insertAccessory = async (entry) => insert(Accessory, entry)
const insertCube = async entry => insert(Cube, entry)
const createUser = async entry => insert(User, entry)

module.exports = {
	dbInit,
	insertCube,
	getAccessoryById,
	insertAccessory,
	getAvailableAccessories,
	getAllCubes,
	getCubeById,
	filterByFieldValues,
	getUserByName,
	createUser,
	updateCube,
}
