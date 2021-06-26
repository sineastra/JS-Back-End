const router = require("express").Router()

// get the custom from dbServices. (hotels, plays, etc)
router.get("/", async (req, res) => {
	const customs = req.user
		? await req.dbServices.custom.getAllSortedByCreateTime('asc')
		: await req.dbServices.custom.getTopNSortedByEnrolled('desc', 3)
	const homePage = req.user ? 'userHome' : 'guestHome'

	res.render(homePage, { customs })
})

module.exports = router
