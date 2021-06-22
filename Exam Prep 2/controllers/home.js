const router = require('express').Router()

router.get('/', async (req, res) => {
	const plays = req.user ? await req.dbServices.play.getAll() : await req.dbServices.play.getFirst3Descending()

	res.render('index', {
		title: 'Home',
		plays,
	})
})

module.exports = router