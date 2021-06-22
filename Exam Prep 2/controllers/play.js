const router = require('express').Router()
const { usersOnly, ownerOnly } = require('../middlewares/routeGuards')
const { body, validationResult } = require('express-validator')

const playParser = (req) => ({
	title: req.body.title,
	description: req.body.description,
	imageUrl: req.body.imageUrl,
	createdAt: Date.now(),
	isPublic: req.body.isPublic !== undefined,
	owner: req.user._id,
})

router.get('/create', usersOnly, (req, res) => res.render('createPlay', { title: 'Create New' }))
router.post('/create', usersOnly, body('title')
		.isLength({ min: 1 })
		.withMessage('Title cannot be empty'),
	body('description')
		.isLength({ min: 1 })
		.withMessage('Description cannot be empty'),
	body('imageUrl')
		.isLength({ min: 1 })
		.withMessage('Image cannot be empty'),
	async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const play = playParser(req)

			await req.dbServices.play.create(play)
			res.redirect('/')
		} else {
			const errorContext = {
				title: 'Create',
				playTitle: req.body.title,
				description: req.body.description,
				imageUrl: req.body.imageUrl,
				isPublic: req.body.isPublic,
			}
			res.locals.errors = errors.array().map(x => x.msg).join('<br />')

			res.render('createPlay', errorContext)
		}

	})
router.get('/details/:id', usersOnly, async (req, res) => {
	const play = await req.dbServices.play.getById(req.params.id)
	const alreadyLiked = play.usersLiked.some(x => x.equals(req.user._id))
	const isOwn = play.owner.equals(req.user._id)

	res.render('details', {
		title: 'Details',
		play: { ...play, alreadyLiked, isOwn },
	})
})

router.get('/delete/:id', ownerOnly, async (req, res) => {
	await req.dbServices.play.deleteById(req.params.id)

	res.redirect('/')
})

router.get('/edit/:id', ownerOnly, async (req, res) => {
	const play = await req.dbServices.play.getById(req.params.id)

	res.render('editPlay', {
		title: 'Edit',
		play,
	})
})
router.post('/edit/:id', ownerOnly, async (req, res) => {
	const updatedPlay = playParser(req)
	await req.dbServices.play.updateById(req.params.id, updatedPlay)

	res.redirect('/')
})

router.get('/like/:id', usersOnly, async (req, res) => {
	await req.dbServices.play.likeById(req.params.id, req.user._id)

	res.redirect('/')
})

router.get('/sort-by-date', async (req, res) => {
	const plays = await req.dbServices.play.getFirstNByDateDesc(4)

	res.render('index', {
		title: 'Home',
		plays,
	})
})
router.get('/sort-by-likes', async (req, res) => {
	const plays = await req.dbServices.play.getFirstNbyLikesDesc(4)

	res.render('index', {
		title: 'Home',
		plays,
	})
})

module.exports = router