const router = require('express').Router()
const { usersOnly, ownerOnly, mustNotBeOwner } = require('../middlewares/routeGuards.js')
const { body, validationResult } = require('express-validator')

const createHotel = async (req, res, next) => {
	const hotel = {
		name: req.body.hotel,
		city: req.body.city,
		freeRooms: req.body['free-rooms'],
		imageUrl: req.body.imageUrl,
		usersWhoBookedRoom: [],
		owner: req.user._id
	}
	await req.dbServices.hotel.create(hotel)

	res.redirect('/')
}

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
router.post('/create', usersOnly, createHotel)

router.get(`/edit/:id`, ownerOnly, async (req, res) => {
	const hotel = await req.dbServices.hotel.getById(req.params.id)

	res.render('edit', hotel)
})

module.exports = router
