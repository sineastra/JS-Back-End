const express = require("express")
const hbs = require("express-handlebars")
const { dbInit } = require("./back-end/back-end-controllers")
const { createGet, createPost } = require("./controllers/create")

const app = express()
const port = 3000

app.engine(
    ".hbs",
    hbs({
        extname: ".hbs",
    })
)

start()

async function start() {
    app.set("view engine", ".hbs")
    app.use(express.static("static"))
    app.use(express.urlencoded({ extended: false }))
    app.use(await dbInit())

    app.get("/", (req, res) => {
        res.render("index")
    })
    app.get("/about", (req, res) => {
        res.render("about")
    })

    app.get("/create", createGet)
    app.post("/create", createPost)

    app.get("/details/:id", (req, res) => {
        res.render("details")
    })

    app.all("*", (req, res) => {
        res.render("404")
    })

    app.listen(port, () => console.log(`Server starded on port ${port}`))
}
