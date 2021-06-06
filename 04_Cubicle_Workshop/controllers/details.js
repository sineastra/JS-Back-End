module.exports = async (req, res) => {
	const id = req.params.id
	const cube = await req.dbController.getCubeById(id)
	const populated = await cube.populate('accessories').execPopulate()

	console.log(populated.accessories)
	res.render('details', {
		title: cube.name,
		cube,
		accessories: populated.accessories,
	})
}
