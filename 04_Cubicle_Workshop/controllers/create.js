module.exports = {
    createGet(req, res) {
        res.render("create")
    },
    async createPost(req, res) {
        const cube = {
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            difficultyLevel: req.body.difficultyLevel,
        }
        console.log(cube)
        await req.dbController.insertEntry(cube)

        res.redirect("/")
    },
}
