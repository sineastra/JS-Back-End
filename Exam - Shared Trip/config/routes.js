const user = require("../controllers/user")
const home = require("../controllers/home")
const custom = require("../controllers/custom")

// associate routes with the controllers (modular routers)
module.exports = app => {
	app.use("/", home)
	app.use("/user", user)
	app.use("/custom", custom)
	app.all('*', (req, res) => res.render('404'))
}
