module.exports = {
	get: (req, res) => {
		const options = [
			{ value: '1', difficultyLevel: '1 - Very Easy' },
			{ value: '2', difficultyLevel: '2 - Easy' },
			{ value: '3', difficultyLevel: '3 - Medium (Standard 3x3)' },
			{ value: '4', difficultyLevel: '4 - Intermediate' },
			{ value: '5', difficultyLevel: '5 - Expert' },
			{ value: '6', difficultyLevel: '6 - Hardcore' },
		].map(x => x.value == req.cube.difficultyLevel ? { ...x, selected: 'selected' } : x)

		res.render('delete', {
			title: `Delete ${req.cube.name}`,
			cube: req.cube,
			options
		})
	},
	post: async (req, res) => {
		await req.dbController.deleteCube(req.cube._id)

		res.redirect('/')
	}
}