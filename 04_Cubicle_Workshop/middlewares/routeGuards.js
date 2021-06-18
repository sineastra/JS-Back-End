module.exports = {
	guestOnly: (req, res, next) =>
		! req.user ? next() : res.redirect('/'),
	userOnly: (req, res, next) =>
		req.user ? next() : res.redirect('/login'),
	ownedOnly: async (req, res, next) => {
		const cube = await req.dbController.getCubeById(req.params.id) || {}

		req.user._id === cube.creatorId ? next() : res.redirect('/')
	}
}