// ADD OWNERONLY IF NEEDED. AND OTHERS. IF NEEDED
// FIX GUEST ONLY
module.exports = {
	usersOnly: (req, res, next) => req.user ? next() : res.redirect('/user/login'),
	guestsOnly: (req, res, next) => !req.user ? next() : res.redirect('/'),
}