const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { TOKEN_SECRET, COOKIE_NAME } = require('../config/variables.js')
const { guestsOnly, usersOnly } = require('../middlewares/routeGuards.js')
const { body, validationResult } = require('express-validator')

const register = async (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const hashedPassword = await bcrypt.hash(req.body.password, 8)

		const newUser = {
			username: req.body.username,
			hashedPassword,
			likedPlays: [],
		}

		await req.dbServices.user.createNew(newUser)

		next()
	} else {
		const errorContext = {
			title: 'Login',
			username: req.body.username,
		}
		res.locals.errors = errors.array().map(x => x.msg).join('<br />')

		res.render('register', errorContext)
	}
}

const login = async (req, res) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const user = await req.dbServices.user.getByUsername(req.body.username)

		if (bcrypt.compare(req.body.password, user.hashedPassword)) {
			const token = jwt.sign({
				_id: user._id,
				username: user.username,
			}, TOKEN_SECRET)
			res.cookie(COOKIE_NAME, token, { httpOnly: true })
			res.redirect('/')
		}
	} else {
		const errorContext = {
			title: 'Login',
			username: req.body.username,
		}

		res.locals.errors = errors.array().map(x => x.msg).join('<br />')

		res.render('login', errorContext)
	}
}

//Register route
router.get('/register', guestsOnly, (req, res) => res.render('register'))
router.post('/register',
	body('username')
		.isLength({ min: 3 })
		.withMessage('Username must be at least 3 characters long')
		.isAlphanumeric()
		.withMessage('Username must consists only latin characters and digits'),
	body('password')
		.isLength({ min: 3 })
		.withMessage('Password must be at least 3 characters long')
		.isAlphanumeric()
		.withMessage('Password must consists only latin characters and digits')
		.custom((value, { req }) => req.customValidators.doPasswordsMatch(value, req))
		.withMessage('Passwords do not match!'),
	guestsOnly,
	register,
	login,
) // VALIDATORS, AFTER GUEST ONLY

// Login route
router.get('/login', guestsOnly, (req, res) => res.render('login'))
router.post('/login',
	guestsOnly,
	body('username')
		.isLength({ min: 3 })
		.withMessage('Username must be at least 3 characters long')
		.isAlphanumeric()
		.withMessage('Username must consists only latin characters and digits'),
	body('password')
		.isLength({ min: 3 })
		.withMessage('Password must be at least 3 characters long')
		.isAlphanumeric()
		.withMessage('Password must consists only latin characters and digits'),
	login,
) // VALIDATORS, AFTER GUEST ONLY

// Logout route
router.get('/logout', usersOnly, (req, res) => {
	res.clearCookie(COOKIE_NAME)
	res.redirect('/')
})

module.exports = router