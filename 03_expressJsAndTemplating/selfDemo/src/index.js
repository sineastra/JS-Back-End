const express = require("express")
const hbs = require("express-handlebars")

const app = express()
const port = 3000

const formValidator = (req, res, next) => {
    if (/.+@.+\..+/g.test(req.body.email) && req.body.password.length > 3) {
        if (req.body.rePass) {
            if (req.body.rePass === req.body.password) {
                next()
            } else {
                res.redirect("/bad-login")
            }
        } else {
            next()
        }
    } else {
        res.redirect("/bad-login")
    }
}

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
        style: "loginStyle.css",
    })
})

app.post("/login", express.urlencoded({ extended: false }), formValidator, (req, res) => {
    res.redirect("/congratz")
})

app.get("/register", (req, res) => {
    res.render("register", {
        style: "registerStyle.css",
    })
})

app.post("/register", express.urlencoded({ extended: false }), formValidator, (req, res) => {
    res.redirect("/congratz")
})

app.get("/congratz", (req, res) => {
    res.render("congratz")
})

app.get("/bad-login", (req, res) => res.render("bad-login"))

app.all("*", (req, res) => {
    console.log(req.status, req.statusCode)
    res.render("error", {
        status: "NOT FAUND",
        statusCode: "4x100+4",
    })
})

app.listen(3000, () => console.log("AI IM STARTID"))
