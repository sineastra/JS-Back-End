module.exports = {
	preloadCube: async (req, res, next) => {
		const id = req.params.id
		const cube = await req.dbController.getCubeById(id)
		const populated = await cube.populate('accessories').execPopulate()

		req.cube = populated

		next()
	}
}