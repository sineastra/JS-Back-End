const uniqid = require("uniqid")

module.exports = {
    createGet(req, res) {
        res.render("create")
    },
    createPost(req, res) {
        const cube = {
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            difficultyLevel: req.body.difficultyLevel,
        }
    },
}
