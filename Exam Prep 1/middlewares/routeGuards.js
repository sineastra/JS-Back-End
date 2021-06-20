module.exports = {
	usersOnly: (req, res, next) => req.user ? next() : res.redirect('/login'),
	guestsOnly: (req, res, next) => ! req.user ? next() : res.redirect('/')
}