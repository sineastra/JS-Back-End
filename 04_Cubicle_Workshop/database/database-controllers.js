const mongoose = require('mongoose')
const Cube = require('./models/Cube.js')

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
			getAllCubes,
			getCubeById,
			filterByFieldValues,
		}
		next()
	}
}

const insertCube = async entry => {
	try {
		await new Cube(entry).save()
	} catch (e) {
		console.log(`Error - ${e} while trying to write to the Database`)
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

module.exports = {
	dbInit,
	insertCube,
	getAllCubes,
	getCubeById,
	filterByFieldValues,
}
