module.exports = {
    create: (req, res) => {
        res.render("create", { title: "create" })
    },
    post: (req, res) => {
        res.redirect("/")
    },
}
