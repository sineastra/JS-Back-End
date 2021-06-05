module.exports = {
	createAccessoryGet (req, res) {
		res.render('createAccessory')
	},
	async createAccessoryPost (req, res) {
		const accessory = {
			name: req.body.name,
			description: req.body.description,
			imageUrl: req.body.imageUrl,
		}
		await req.dbController.insertAccessory(accessory)

		res.redirect('/')
	},
}