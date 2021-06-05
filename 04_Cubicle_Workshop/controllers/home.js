module.exports = async (req, res) => {
	const allCubes = await req.dbController.getAllCubes()

	const cubes =
		Object.keys(req.query).length === 0
			? allCubes
			: await req.dbController.filterByFieldValues(req.query)

	res.render('index', {
		title: 'Home page',
		cubes,
	})
}
