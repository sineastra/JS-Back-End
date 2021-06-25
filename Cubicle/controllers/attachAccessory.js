module.exports = {
	async attachAccessoryGet (req, res) {
		const accessories = await req.dbController.getAvailableAccessories(req.cube._id)

		res.render('attachAccessory', {
			title: `attach to ${req.cube.name}`,
			cube: req.cube,
			accessories,
		})
	},
	async attachAccessoryPost (req, res) {
		const accessory = await req.dbController.getAccessoryById(req.body.accessory)

		if (! req.cube.accessories.some(x => x._id.equals(accessory._id))) {
			req.cube.accessories.push(accessory)
			accessory.cubes.push(req.cube)
		}

		await req.cube.save()
		await accessory.save()

		res.redirect(`/details/${req.cube._id}`)
	},
}