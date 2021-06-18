module.exports = {
	preloadCube: async (req, res, next) => {
		const id = req.params.id
		const cube = await req.dbController.getCubeById(id)

		req.cube = cube

		next()
	}
}