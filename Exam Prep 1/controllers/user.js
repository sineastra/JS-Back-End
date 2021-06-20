const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { TOKEN_SECRET, COOKIE_NAME } = require('../config/variables.js')
const { guestsOnly } = require('../middlewares/routeGuards.js')
const { body, validationResult } = require('express-validator')

const register = async (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const hashedPassword = await bcrypt.hash(req.body.password, 8)

		const newUser = {
			email: req.body.email,
			username: req.body.username,
			hashedPassword,
			bookedHotels: [],
			offeredHotels: []
		}

		await req.dbServices.user.createNew(newUser)

		next()
	} else {
		const errorContext = {
			title: 'Login',
			errors: errors,
			username: req.body.username,
			email: req.body.email,
		}
		res.render('register', errorContext)
	}
}

const login = async (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const user = await req.dbServices.user.getByEmail(req.body.email)

		if (bcrypt.compare(req.body.password, user.hashedPassword)) {
			const token = jwt.sign({
				_id: user._id,
				username: user.username,
				email: user.email,
			}, TOKEN_SECRET)
			res.cookie(COOKIE_NAME, token, { httpOnly: true })
			res.redirect('/')
		}
	} else {
		const errorContext = {
			title: 'Login',
			errors: errors,
			email: req.body.email
		}
		res.render('login', errorContext)
	}
}


router.get('/register', guestsOnly, (req, res) => res.render('register'))
router.post('/register',
	guestsOnly,
	body('email')
		.trim()
		.escape()
		.normalizeEmail()
		.isEmail()
		.custom(async (value, { req }) => await req.customValidators.existingEmail(value, req)),
	body('username')
		.trim()
		.escape()
		.custom(async (value, { req }) => await req.customValidators.existingUsername(value, req))
		.customSanitizer(username => username.toLocaleLowerCase()),
	body('password')
		.custom((value, { req }) => req.customValidators.passwordsMatch(value, req)),
	register,
	login)

router.get('/login', guestsOnly, (req, res) => res.render('login'))
router.post('/login',
	guestsOnly,
	body('email')
		.trim()
		.escape()
		.normalizeEmail()
		.isEmail()
		.custom(async (value, { req }) => await req.customValidators.registeredUser(value, req)),
	login)

router.get('/logout', (req, res) => {
	res.clearCookie(COOKIE_NAME)
	res.redirect('/')
})

module.exports = router