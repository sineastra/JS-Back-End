const router = require('express').Router()
const { usersOnly } = require('../middlewares/routeGuards.js')

router.get('/details/:id', /*usersOnly*/ async (req, res) => {
	const hotel = await req.dbServices.hotel.getOneById(req.params.id)
	req.user = { _id: '60cf26e6f11b685ed8041e62' }

	hotel.isOwn = hotel.owner === req.user._id
	hotel.alreadyBooked = hotel.usersWhoBookedRoom.includes(req.user._id)

	res.render('details', {
		title: `${hotel.name} details`,
		hotel
	})
})

module.exports = router
