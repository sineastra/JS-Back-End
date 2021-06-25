const router = require("express").Router()
const { usersOnly, ownerOnly, notOwnerOnly } = require("../middlewares/routeGuards")
const { body, validationResult } = require("express-validator")
const custom = require("../db/services/custom")
const { createErrorMsg } = require("../helpers/helper")

router.get("/create", usersOnly, (req, res) => res.render("create"))
router.post(
	"/create",
	usersOnly,
	body('name')
		.isLength({ min: 1 })
		.withMessage('Name must not be empty'),
	body('price')
		.isLength({ min: 1 })
		.withMessage('Price must not be empty')
		.isNumeric()
		.withMessage('Price must be a number'),
	body('imageUrl')
		.isLength({ min: 1 })
		.withMessage('Image must not be empty'),
async (req, res) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const custom = {
			name: req.body.name,
			price: req.body.price,
			imageUrl: req.body.imageUrl,
			description: req.body.description,
			brand: req.body.brand,
			createdAt: Date.now(),
			buyers: [],
			owner: req.user._id,
		}
		await req.dbServices.custom.create(custom)
		res.redirect('/')
	} else {
		res.locals.errors = createErrorMsg(errors)

		res.render("create", custom)
	}
},
)

// DETAILS
router.get(
	"/details/:id", usersOnly, async (req, res) => {
		const custom = await req.dbServices.custom.getById(req.params.id)

		custom.isOwn = custom.owner.equals(req.user._id)
		custom.alreadyBought = custom.buyers.some(x => x.equals(req.user._id))

		res.render('details', custom)
	},
)

// DELETE
router.get("/delete/:id", ownerOnly, async (req, res) => {
	await req.dbServices.custom.deleteById(req.params.id)
	res.redirect('/')
})

// EDIT
router.get(
	"/edit/:id", ownerOnly, async (req, res) => {
		const play = await req.dbServices.custom.getById(req.params.id)

		res.render("edit", play)
	},
)
router.post(
	"/edit/:id", ownerOnly, async (req, res) => {
		const updatedPlay = {
			name: req.body.name,
			price: req.body.price,
			description: req.body.description,
			imageUrl: req.body.imageUrl,
			brand: req.body.brand,
		}
		await req.dbServices.custom.updateById(req.params.id, updatedPlay)

		res.redirect(`/custom/details/${req.params.id}`)
	},
)

router.get('/buy/:id', notOwnerOnly, async (req, res) => {
	await req.dbServices.custom.buy(req.user._id, req.params.id)
	await req.dbServices.user.buy(req.user._id, req.params.id)

	res.redirect(`/custom/details/${req.params.id}`)
})

module.exports = router