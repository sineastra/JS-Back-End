const express = require("express")
const hbs = require("express-handlebars")

const app = express()
const port = 3000

app.engine(
    ".hbs",
    hbs({
        partialsDir: "partials",
        extname: ".hbs",
    })
)

app.set("view engine", ".hbs")

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login", {
        style: 'loginStyle.css'
    })
})

app.get('/congratz', (req, res) => {
    res.render('congratz')
})

app.post('/login', (req, res) => {
    res.redirect('/congratz')
})

app.listen(3000, () => console.log("AI IM STARTID"))
