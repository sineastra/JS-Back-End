module.exports = async (req, res) => {
    const id = req.params.id
    const cube = await req.dbController.getEntryById(id)

    res.render("details", {
        title: cube.name,
        cube,
    })
}
