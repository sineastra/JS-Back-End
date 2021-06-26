const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const { TOKEN_SECRET, COOKIE_NAME } = require("../config/variables.js")
const { guestsOnly, usersOnly } = require("../middlewares/routeGuards.js")
const { body, validationResult } = require("express-validator")
const { createErrorMsg } = require("../helpers/helper")

const register = async (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(req.body.password, 8)

        // change the fields
        const newUser = {
            email: req.body.email,
            username: req.body.username,
            hashedPassword,
        }

        await req.dbServices.user.createNew(newUser)

        next()
    } else {
        // if needed change the fields here also.
        const errorContext = {
            username: req.body.username,
            email: req.body.email,
        }
        res.locals.errors = createErrorMsg(errors)

        res.render("register", errorContext)
    }
}

const login = async (req, res) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        // change the get user if needed! It may be by username.
        const user = await req.dbServices.user.getByEmail(req.body.email)

        if (bcrypt.compare(req.body.password, user.hashedPassword)) {
            // check token fields
            const token = jwt.sign(
                {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                },
                TOKEN_SECRET
            )
            res.cookie(COOKIE_NAME, token, { httpOnly: true })
            res.redirect("/")
        }
    } else {
        // change context error if needed (dont forget to change the variable in templates too)
        const errorContext = {
            title: "Login",
            email: req.body.email,
        }

        res.locals.errors = createErrorMsg(errors)

        res.render("login", errorContext)
    }
}

//Register route
router.get("/register", /*guestsOnly,*/ (req, res) => res.render("register"))
router.post(
    "/register",
    /*guestsOnly,*/
    body("password")
        .custom((value, { req }) => req.customValidators.doPasswordsMatch(value, req))
        .withMessage("Passwords do not match!"),
    register,
    login
) // VALIDATORS, AFTER GUEST ONLY

// Login route
router.get("/login", /*guestsOnly,*/ (req, res) => res.render("login"))
router.post("/login", /*guestsOnly,*/ login) // VALIDATORS, AFTER GUEST ONLY

// Logout route
router.get(
    "/logout",
    /*usersOnly,*/ (req, res) => {
        res.clearCookie(COOKIE_NAME)
        res.redirect("/")
    }
)

module.exports = router
