const user = require("../db/services/user")
const custom = require("../db/services/custom")

// include all the services, which are in db/services, which use db/model
module.exports = (req, res, next) => {
    req.dbServices = {
        user,
        custom,
    }

    next()
}