const express = require("express")
const hbs = require("express-handlebars")
const { about } = require("./controllers/about")
const { catalog } = require("./controllers/catalog")
const create = require("./controllers/create")
const { details } = require("./controllers/details")
const { notFound } = require("./controllers/notFound")

const app = express()
const port = 3000

app.engine(
    ".hbs",
    hbs({
        extname: ".hbs",
    })
)

app.set("view engine", ".hbs")

app.use("/static", express.static("static"))

app.get("/", catalog)
app.get("/about", about)
app.get("/create", create.create)
app.post("/create", create.post)
app.get("/details/:id", details)


app.all("*", notFound)

app.listen(port, () => console.log(`Server lisstening on port ${port}`))
