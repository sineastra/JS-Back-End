const router = require('express').Router()

router.get('/', async (req, res) => {
	const plays = req.user ? await req.dbServices.custom.getAll() : await req.dbServices.custom.getFirstNbyLikesDesc(3)

	res.render('index', {
		title: 'Home',
		plays,
	})
})

module.exports = router