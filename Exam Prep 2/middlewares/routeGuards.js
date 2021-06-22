// ADD OWNERONLY IF NEEDED. AND OTHERS. IF NEEDED
// FIX GUEST ON
module.exports = {
	usersOnly: (req, res, next) => req.user ? next() : res.redirect('/user/login'),
	guestsOnly: (req, res, next) => !req.user ? next() : res.redirect('/'),
	ownerOnly: async (req, res, next) => {
		const play = await req.dbServices.play.getById(req.params.id)

		play.owner.equals(req.user._id) ? next() : res.redirect('/login')
	},
}