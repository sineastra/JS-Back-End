module.exports = {
	guestOnly: (req, res, next) =>
		! req.user ? next() : res.redirect('/'),
	userOnly: (req, res, next) =>
		req.user ? next() : res.redirect('/login'),
	ownedOnly: async (req, res, next) =>
		req.user._id === req.cube.creatorId ? next() : res.redirect('/')

}