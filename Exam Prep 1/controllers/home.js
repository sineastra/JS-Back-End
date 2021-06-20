const router = require('express').Router()

router.get('/', async (req, res) => {
	// const hotel = {
	// 	name: 'Pesho Hotel',
	// 	city: 'Pesho City',
	// 	imageUrl: 'https://pix10.agoda.net/hotelImages/923/923925/923925_16061414320043542386.jpg?s=1024x768',
	// 	freeRooms: 100,
	// 	usersWhoBookedRoom: [],
	// 	owner: 'Bat ti Pesho'
	// }
	// await req.dbServices.hotel.writeOne(hotel)
	const hotels = await req.dbServices.hotel.getAll()

	hotels.sort((a, b) => b.freeRooms - a.freeRooms)

	const renderContext = {
		title: 'Hotels',
		hotels
	}

	res.render('home', renderContext)
})

module.exports = router