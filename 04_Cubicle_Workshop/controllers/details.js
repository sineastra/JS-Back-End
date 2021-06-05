module.exports = async (req, res) => {
    const id = req.params.id
    const cube = await req.dbController.getCubeById(id)
    console.log(cube)

    res.render("details", {
        title: cube.name,
        cube,
    })
}
