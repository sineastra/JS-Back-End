module.exports = async (req, res) => {
	console.log(req.cube)
	const populated = await req.cube.populate('accessories').execPopulate()
	const isOwner = req.user && req.cube && req.user._id === req.cube.creatorId

	res.render('details', {
		title: req.cube.name,
		cube: req.cube,
		accessories: populated.accessories,
		isOwner
	})
}
