module.exports = async (req, res) => {
    const cubes = await req.dbController.getAllEntries()
    res.render("index", {
        title: "Home page",
        cubes,
    })
}
