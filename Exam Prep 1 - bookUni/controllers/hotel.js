const router = require('express').Router()
const { usersOnly, ownerOnly, mustNotBeOwner } = require('../middlewares/routeGuards.js')
const { body, validationResult } = require('express-validator')

const hotelFactory = (req) => ({
	name: req.body.hotel,
	city: req.body.city,
	freeRooms: req.body['free-rooms'],
	imageUrl: req.body.imageUrl,
	usersWhoBookedRoom: [],
	owner: req.user._id
})

// Details route
router.get('/details/:id', usersOnly, async (req, res) => {
	const hotel = await req.dbServices.hotel.getById(req.params.id)

	hotel.isOwn = hotel.owner === req.user._id
	hotel.alreadyBooked = hotel.usersWhoBookedRoom.includes(req.user._id)

	res.render('details', {
		title: `${hotel.name} details`,
		hotel
	})
})
router.get('/details/:id/book', usersOnly, mustNotBeOwner, async (req, res) => {
	const hotel = await req.dbServices.hotel.getById(req.params.id)
	const user = await req.dbServices.user.getByEmail(req.user.email)

	hotel.freeRooms -= 1
	hotel.usersWhoBookedRoom.push(req.user._id)

	user.bookedHotels.push(hotel._id)

	await req.dbServices.hotel.update(hotel._id, hotel)
	await req.dbServices.user.update(user._id, user)

	res.redirect('/')
})

// Create route
router.get('/create',
	usersOnly,
	(req, res) => res.render('create', { title: 'create hotel', hotel: {} }))
router.post('/create',
	usersOnly,
	body('hotel', 'Hotel name must be at least 4 characters long').isLength({ min: 4 }),
	body('city', 'City name must be at least 3 characters long').isLength({ min: 3 }),
	body('imageUrl', 'Image must be a valid URL').isURL(),
	body('free-rooms', 'Rooms must be between 1 and 100').isInt({ min: 1, max: 100 }),
	async (req, res) => {
		const errors = validationResult(req)
		const hotel = hotelFactory(req)

		if (errors.isEmpty()) {
			await req.dbServices.hotel.create(hotel)

			res.redirect('/')
		} else {
			const errorMessages = errors.array().map(x => x.msg).join('<br />')
			res.locals.errors = errorMessages
			console.log(errorMessages)
			res.render('create', { title: 'Create new hotel', hotel })
		}
	}
)

// Edit route
router.get(`/edit/:id`, ownerOnly, async (req, res) => {
	const hotel = await req.dbServices.hotel.getById(req.params.id)

	res.render('edit', { title: `Edit ${hotel.name}`, hotel })
})
router.post(`/edit/:id`, ownerOnly, async (req, res) => {
	const _id = req.params.id
	const updatedHotel = hotelFactory(req)

	await req.dbServices.hotel.update(_id, updatedHotel)

	res.redirect('/')
})

// Delete route
router.get('/delete/:id', ownerOnly, async (req, res) => {
	const hotel = await req.dbServices.hotel.deleteById(req.params.id)

	res.redirect('/')
})

module.exports = router
