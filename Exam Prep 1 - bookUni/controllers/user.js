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
			username: req.body.username,
			email: req.body.email,
		}
		res.locals.errors = errors.array().map(x => x.msg).join('<br />')

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
			email: req.body.email
		}

		res.locals.errors = errors.array().map(x => x.msg).join('<br />')

		res.render('login', errorContext)
	}
}

//Register route
router.get('/register', guestsOnly, (req, res) => res.render('register'))
router.post('/register',
	guestsOnly,
	body('email')
		.trim()
		.escape()
		.normalizeEmail()
		.isAlphanumeric()
		.withMessage('Email must contain only Latin letters and digits')
		.isEmail()
		.withMessage('Not a valid email')
		.custom(async (value, { req }) => await req.customValidators.isEmailTaken(value, req))
		.withMessage('Email already taken. Please pick another!'),
	body('username')
		.trim()
		.escape()
		.custom(async (value, { req }) => await req.customValidators.isUsernameTaken(value, req))
		.withMessage('Username already taken. PLease pick another!')
		.customSanitizer(username => username.toLocaleLowerCase()),
	body('password')
		.isLength({ min: 5 })
		.withMessage('Password must be at least 5 characters long')
		.isAlphanumeric()
		.withMessage('Password must contains only Latin letters and digits')
		.custom((value, { req }) => req.customValidators.doPasswordsMatch(value, req))
		.withMessage('Passwords do not match!'),
	register,
	login)

// Login route
router.get('/login', guestsOnly, (req, res) => res.render('login'))
router.post('/login',
	guestsOnly,
	body('email')
		.trim()
		.escape()
		.normalizeEmail()
		.isEmail()
		.withMessage('Not a valid email')
		.custom(async (value, { req }) => await req.customValidators.isRegisteredUser(value, req)),
	login)

// Logout route
router.get('/logout', (req, res) => {
	res.clearCookie(COOKIE_NAME)
	res.redirect('/')
})

// Profile route
router.get('/profile', async (req, res) => {
	const user = await req.dbServices.user.getById(req.user._id)

	res.render('profile',
		{
			title: `${user.username} profile`,
			user
		})
})

module.exports = router