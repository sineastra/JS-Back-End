module.exports = {
	usersOnly: (req, res, next) => req.user ? next() : res.redirect('/login'),
	guestsOnly: (req, res, next) => ! req.user ? next() : res.redirect('/'),
	ownerOnly: async (req, res, next) => {
		try {
			const hotel = await req.dbServices.hotel.getById(req.params.id)
			console.log(hotel.owner === req.user._id)
			if (hotel.owner === req.user._id) {
				next()
			} else {
				throw new Error('User not owner!')
			}
		} catch (e) {
			console.log(e.message)
			res.redirect('/')
		}
	},
	mustNotBeOwner: async (req, res, next) => {
		try {
			const hotel = await req.dbServices.hotel.getById(req.params.id)
			if (hotel.owner !== req.user._id) {
				next()
			} else {
				throw new Error('User is the owner!')
			}
		} catch (e) {
			res.redirect('/')
		}
	}
}