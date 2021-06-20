const router = require('express').Router()

router.get('/', async (req, res) => {
	const hotels = await req.dbServices.hotel.getAll()

	hotels.sort((a, b) => b.freeRooms - a.freeRooms)

	const renderContext = {
		title: 'Hotels',
		hotels
	}

	res.render('home', renderContext)
})

module.exports = router