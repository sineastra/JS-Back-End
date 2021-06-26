const router = require("express").Router()
const { usersOnly, ownerOnly } = require("../middlewares/routeGuards")
const { body, validationResult } = require("express-validator")
const custom = require("../db/services/custom")
const { createErrorMsg } = require("../helpers/helper")

// CREATE
router.get("/create", /*usersOnly,*/ (req, res) => res.render("create"))
router.post(
    "/create",
    /*usersOnly,*/ async (req, res) => {
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            // const custom = factory(req)
            // await req.dbServices.custom.create(custom)
            // res.redirect('/'')
        } else {
            res.locals.errors = createErrorMsg(errors)

            // res.render("create", custom)
        }
    }
)

// DETAILS
router.get(
    "/details/:id",
    /*usersOnly,*/ async (req, res) => {
        // const custom = await req.dbServices.custom.getById(req.params.id)
        // custom.isOwn = custom.owner.equals(req.user._id)
        // others fields if neccesary (alreadyLiked, alreadyBooked)
        // res.render('details', {custom})
    }
)

// DELETE
router.get(
    "/delete/:id",
    /*ownerOnly,*/ async (req, res) => {
        // await req.dbServices.custom.deleteById(req.params.id)
        // res.redirect('/')
    }
)

// EDIT
router.get(
    "/edit/:id",
    /*ownerOnly,*/ async (req, res) => {
        // const play = await req.dbServices.custom.getById(req.params.id)
        // res.render("edit", { play })
    }
)
router.post(
    "/edit/:id",
    /*ownerOnly,*/ async (req, res) => {
        // const updatedPlay = playParser(req)
        // await req.dbServices.custom.updateById(req.params.id, updatedPlay)
        // res.redirect("/")
    }
)

module.exports = router
