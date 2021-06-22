const router = require('express').Router()
const { usersOnly } = require('../middlewares/routeGuards')

const playParser = ({ title, description, imageUrl, isPublic }) => ({
	title,
	description,
	imageUrl,
	createdAt: Date.now(),
	isPublic: isPublic !== undefined,
})

router.get('/create', usersOnly, (req, res) => res.render('createPlay', { title: 'Create New' }))
router.post('/create', usersOnly, async (req, res) => {
	const play = playParser(req.body)

	await req.dbServices.play.create(play)

	res.redirect('/')
})
router.get('/details/:id', async (req, res) => {
	const play = await req.dbServices.play.getById(req.params.id)

	res.render('details', {
		title: 'Details',
		play,
	})
})

module.exports = router