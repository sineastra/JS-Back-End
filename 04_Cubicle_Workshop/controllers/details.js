module.exports = async (req, res) => {
	const isOwner = req.user && req.cube && req.user._id === req.cube.creatorId

	res.render('details', {
		title: req.cube.name,
		cube: req.cube,
		accessories: req.cube.accessories,
		isOwner
	})
}
