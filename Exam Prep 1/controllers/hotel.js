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

	hotel.freeRooms -= 1
	hotel.usersWhoBookedRoom.push(req.user._id)

	await req.dbServices.hotel.update(hotel._id, hotel)

	res.redirect('/')
})

router.get('/create', usersOnly, (req, res) => res.render('create'))
router.post('/create', usersOnly, async (req, res) => {
	await req.dbServices.hotel.create(hotelFactory(req))

	res.redirect('/')
})

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

router.get('/delete/:id', ownerOnly, async (req, res) => {
	const hotel = await req.dbServices.hotel.deleteById(req.params.id)

	res.redirect('/')
})

module.exports = router
