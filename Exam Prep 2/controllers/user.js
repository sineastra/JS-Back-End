const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { TOKEN_SECRET, COOKIE_NAME } = require('../config/variables.js')
const { guestsOnly } = require('../middlewares/routeGuards.js')
const { body, validationResult } = require('express-validator')

const register = async (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		console.log(req.body.password)
		const hashedPassword = await bcrypt.hash(req.body.password, 8)

		// change the fields (DONT FORGET TO CHANGE THE MODEL IN DB/MODELS/USER) also.
		const newUser = {
			username: req.body.username,
			hashedPassword,
			likedPlays: [],
		}

		await req.dbServices.user.createNew(newUser)

		next()
	} else {

		// if needed change the fields here also.
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
router.post('/register', guestsOnly, register, login) // VALIDATORS, AFTER GUEST ONLY

// Login route
router.get('/login', guestsOnly, (req, res) => res.render('login'))
router.post('/login', guestsOnly, login) // VALIDATORS, AFTER GUEST ONLY

// Logout route
router.get('/logout', (req, res) => {
	res.clearCookie(COOKIE_NAME)
	res.redirect('/')
})

module.exports = router