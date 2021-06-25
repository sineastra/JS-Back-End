const user = require("../db/services/user")
const custom = require("../db/services/custom")

// include all the services,
module.exports = (req, res, next) => {
    req.dbServices = {
        user,
        custom,
    }

    next()
}
