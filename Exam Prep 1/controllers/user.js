const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { TOKEN_SECRET, COOKIE_NAME } = require('../config/variables.js')
const { guestsOnly } = require('../middlewares/routeGuards.js')

const register = async (req, res, next) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 8)

	const newUser = {
		email: req.body.email,
		username: req.body.username,
		hashedPassword,
		bookedHotels: [],
		offeredHotels: []
	}

	await req.dbServices.user.createNew(newUser)

	res.redirect('/')
	next()
}

const login = async (req, res, next) => {
	const user = await req.dbServices.user.getByUsername(req.body.username)

	if (bcrypt.compare(req.body.password, user.hashedPassword)) {
		const token = jwt.sign({
			_id: user._id,
			username: user.username,
			email: user.email,
		}, TOKEN_SECRET)
		res.cookie(COOKIE_NAME, token, { httpOnly: true })
		res.redirect('/')
	}
}


router.get('/register', guestsOnly, (req, res) => res.render('register'))
router.post('/register', guestsOnly, register, login)

router.get('/login', guestsOnly, (req, res) => res.render('login'))
router.post('/login', guestsOnly, login)

router.get('/logout', (req, res) => {
	res.clearCookie(COOKIE_NAME)
	res.redirect('/')
})

module.exports = router