const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const { TOKEN_SECRET, COOKIE_NAME } = require("../config/variables.js")
const { guestsOnly, usersOnly } = require("../middlewares/routeGuards.js")
const { body, validationResult } = require("express-validator")
const { createErrorMsg } = require("../helpers/helper")

const register = async (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const hashedPassword = await bcrypt.hash(req.body.password, 8)

		const newUser = {
			username: req.body.username,
			hashedPassword,
			enrolledCourse: [],
		}

		await req.dbServices.user.createNew(newUser)

		next()
	} else {
		res.locals.errors = createErrorMsg(errors)

		res.render("register", req.body)
	}
}

const login = async (req, res) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const user = await req.dbServices.user.getByUsername(req.body.username)

		if (bcrypt.compare(req.body.password, user.hashedPassword)) {
			const token = jwt.sign(
				{
					_id: user._id,
					username: user.username,
				},
				TOKEN_SECRET,
			)
			res.cookie(COOKIE_NAME, token, { httpOnly: true })
			res.redirect("/")
		}
	} else {
		res.locals.errors = createErrorMsg(errors)

		res.render("login", req.body)
	}
}

//Register route
router.get("/register", guestsOnly, (req, res) => res.render("register"))
router.post("/register",
	guestsOnly,
	body("username")
		.isLength({ min: 5 })
		.withMessage("Username at least 5 symbols!")
		.isAlphanumeric()
		.withMessage("Username only english letters and digits!!"),
	body("password")
		.isLength({ min: 5 })
		.withMessage("Password at least 5 symbols!")
		.isAlphanumeric()
		.withMessage("Password only english letters and digits!!")
		.custom((value, { req }) => req.customValidators.doPasswordsMatch(value, req))
		.withMessage("Passwords do not match!"),
	register,
	login,
)

// Login route
router.get("/login", guestsOnly, (req, res) => res.render("login"))
router.post("/login",
	guestsOnly,
	body("username")
		.isLength({ min: 5 })
		.withMessage("Username at least 5 symbols!")
		.isAlphanumeric()
		.withMessage("Username only english letters and digits!!"),
	body("password")
		.isLength({ min: 5 })
		.withMessage("Password at least 5 symbols!")
		.isAlphanumeric()
		.withMessage("Password only english letters and digits!!"),
	login,
)

// Logout route
router.get("/logout", usersOnly, (req, res) => {
		res.clearCookie(COOKIE_NAME)
		res.redirect("/")
	},
)

module.exports = router
