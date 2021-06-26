const router = require("express").Router()

// get the custom from dbServices. (hotels, plays, etc)
router.get("/", async (req, res) => {
    const customs = req.user ? await req.dbServices.custom.getAll() : {}

    res.render("home", { customs })
})

module.exports = router
