const router = require("express").Router()
const { usersOnly, ownerOnly } = require("../middlewares/routeGuards")
const { body, validationResult } = require("express-validator")
const custom = require("../db/services/custom")
const { createErrorMsg } = require("../helpers/helper")

// CREATE
router.get("/create", usersOnly, (req, res) => res.render("create"))
router.post(
	"/create",
	body('title')
		.isLength({ min: 4 })
		.withMessage("Title at least 4 symbols!"),
	body('description')
		.isLength({ min: 20 })
		.withMessage("Description at least 20 symbols!"),
	body('imageUrl')
		.isURL({ protocols: ["http", "https"] })
		.withMessage("Image must be a valid URL!"),
	usersOnly, async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const custom = {
				title: req.body.title,
				description: req.body.description,
				imageUrl: req.body.imageUrl,
				duration: req.body.duration,
				createdAt: Date.now(),
				usersEnrolled: [],
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
	"/details/:id",
	usersOnly, async (req, res) => {
		const custom = await req.dbServices.custom.getById(req.params.id)

		custom.isOwn = custom.owner.equals(req.user._id)
		custom.alreadyEnrolled = custom.usersEnrolled.some(x => x.equals(req.user._id))

		res.render('details', custom)
	},
)

// DELETE
router.get(
	"/delete/:id",
	ownerOnly, async (req, res) => {
		await req.dbServices.custom.deleteById(req.params.id)
		res.redirect('/')
	},
)

// EDIT
router.get(
	"/edit/:id",
	ownerOnly, async (req, res) => {
		const play = await req.dbServices.custom.getById(req.params.id)

		res.render("edit", play)
	},
)
router.post("/edit/:id", ownerOnly, async (req, res) => {
		const updatedPlay = {
			title: req.body.title,
			description: req.body.description,
			imageUrl: req.body.imageUrl,
			duration: req.body.duration,
		}

		await req.dbServices.custom.updateById(req.params.id, updatedPlay)
		res.redirect("/")
	},
)

router.get('/enroll/:id', async (req, res) => {
	await req.dbServices.custom.enroll(req.params.id, req.user._id)

	res.redirect("/")
})

module.exports = router
