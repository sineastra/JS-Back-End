module.exports = {
	async attachAccessoryGet (req, res) {
		const cube = await req.dbController.getCubeById(req.params.cubeId)
		const accessories = await req.dbController.getAvailableAccessories(req.params.cubeId)

		res.render('attachAccessory', {
			title: `attach to ${cube.name}`,
			cube,
			accessories,
		})
	},
	async attachAccessoryPost (req, res) {
		const cube = await req.dbController.getCubeById(req.params.cubeId)
		const accessory = await req.dbController.getAccessoryById(req.body.accessory)

		if (! cube.accessories.some(x => x._id.equals(accessory._id))) {
			cube.accessories.push(accessory)
			accessory.cubes.push(cube)
		}

		await cube.save()
		await accessory.save()

		res.redirect(`/details/${cube._id}`)
	},
}