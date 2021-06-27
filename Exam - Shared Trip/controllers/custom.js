const router = require("express").Router()
const { usersOnly, ownerOnly, notOwnerOnly } = require("../middlewares/routeGuards")
const { body, validationResult } = require("express-validator")
const custom = require("../db/services/custom")
const { createErrorMsg } = require("../helpers/helper")

router.get('/', async (req, res) => {
	const customs = await req.dbServices.custom.getAll()

	res.render('custom', { customs })
})

// CREATE
router.get("/create", usersOnly, (req, res) => res.render("create"))
router.post(
	"/create",
	usersOnly,
	body('startPoint')
		.isLength({ min: 4 })
		.withMessage('Start Point must be at least 4 symbols long.'),
	body('endPoint')
		.isLength({ min: 4 })
		.withMessage('End Point must be at least 4 symbols long.'),
	body('seats')
		.isInt({ min: 0, max: 4 })
		.withMessage('Seats must be from 0 to 4'),
	body('description')
		.isLength({ min: 10 })
		.withMessage('Description. must be at least 10 symbols'),
	body('carImage')
		.isURL({ protocols: ["http", "https"] })
		.withMessage('Car Image must be a valid URL'),
	body('carBrand')
		.isLength({ min: 4 })
		.withMessage('Car brand must be at least 4 symbols'),
	body('price')
		.isInt({ min: 1, max: 50 })
		.withMessage('Price must be from 1 to 50'),
	async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const custom = {
				startPoint: req.body.startPoint,
				endPoint: req.body.endPoint,
				date: req.body.date,
				time: req.body.time,
				carImage: req.body.carImage,
				carBrand: req.body.carBrand,
				seats: req.body.seats,
				price: req.body.price,
				description: req.body.description,
				creator: req.user._id,
				buddies: [],
			}

			const trip = await req.dbServices.custom.create(custom)
			await req.dbServices.user.addTrip(trip._id, req.user._id)

			res.redirect('/custom')
		} else {
			res.locals.errors = createErrorMsg(errors)

			res.render("create", req.body)
		}
	},
)

// DETAILS
router.get(
	"/details/:id",
	async (req, res) => {
		const custom = await req.dbServices.custom.getByIdPopulated(req.params.id)
		const driverData = await req.dbServices.user.getById(custom.creator)

		if (req.user) {
			custom.isOwn = custom.creator.equals(req.user._id)
			custom.alreadyJoined = custom.buddies.some(x => x._id.equals(req.user._id))
			custom.freeSeats =
				custom.seats - custom.buddies.length > 0
					? custom.seats - custom.buddies.length
					: false
		}

		custom.driver = driverData.email
		custom.buddies = custom.buddies.map(x => x.email).join(', ')

		res.render('details', custom)
	},
)

// DELETE
router.get(
	"/delete/:id",
	ownerOnly, async (req, res) => {
		await req.dbServices.custom.deleteById(req.params.id)
		res.redirect('/custom')
	},
)

// EDIT
router.get(
	"/edit/:id",
	ownerOnly,
	async (req, res) => {
		const play = await req.dbServices.custom.getById(req.params.id)
		res.render("edit", play)
	},
)
router.post(
	"/edit/:id",
	ownerOnly,
	body('startPoint')
		.isLength({ min: 4 })
		.withMessage('Start Point must be at least 4 symbols long.'),
	body('endPoint')
		.isLength({ min: 4 })
		.withMessage('End Point must be at least 4 symbols long.'),
	body('seats')
		.isInt({ min: 0, max: 4 })
		.withMessage('Seats must be from 0 to 4'),
	body('description')
		.isLength({ min: 10 })
		.withMessage('Description. must be at least 10 symbols'),
	body('carImage')
		.isURL({ protocols: ["http", "https"] })
		.withMessage('Car Image must be a valid URL'),
	body('carBrand')
		.isLength({ min: 4 })
		.withMessage('Car brand must be at least 4 symbols'),
	body('price')
		.isInt({ min: 1, max: 50 })
		.withMessage('Price must be from 1 to 50'),
	async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const updatedPlay = {
				startPoint: req.body.startPoint,
				endPoint: req.body.endPoint,
				date: req.body.date,
				time: req.body.time,
				carImage: req.body.carImage,
				carBrand: req.body.carBrand,
				seats: req.body.seats,
				price: req.body.price,
				description: req.body.description,
			}
			await req.dbServices.custom.updateById(req.params.id, updatedPlay)

			res.redirect(`/custom/details/${req.params.id}`)
		} else {
			res.locals.errors = createErrorMsg(errors)

			res.render("edit", req.body)
		}
	},
)

router.get('/join/:id', usersOnly, notOwnerOnly, async (req, res) => {
	const custom = await req.dbServices.custom.getById(req.params.id)
	custom.buddies.push(req.user._id)

	await req.dbServices.custom.updateById(req.params.id, custom)

	res.redirect(`/custom/details/${req.params.id}`)
})

module.exports = router
