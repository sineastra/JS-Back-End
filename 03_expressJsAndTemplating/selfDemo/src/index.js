const express = require("express")
const hbs = require("express-handlebars")

const app = express()
const port = 3000

app.engine(
    ".hbs",
    hbs({
        extname: ".hbs",
    })
)

app.set("view engine", ".hbs")

app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, () => console.log("AI IM STARTID"))
