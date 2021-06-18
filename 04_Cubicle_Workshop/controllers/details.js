module.exports = async (req, res) => {
	const id = req.params.id
	const cube = await req.dbController.getCubeById(id)
	const populated = await cube.populate('accessories').execPopulate()
	const isOwner = req.user && cube && req.user._id === cube.creatorId

	res.render('details', {
		title: cube.name,
		cube,
		accessories: populated.accessories,
		isOwner
	})
}
