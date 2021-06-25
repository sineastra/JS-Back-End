const user = require("../db/services/user")
const custom = require("../db/services/custom")

// include all
module.exports = (req, res, next) => {
    req.dbServices = {
        user,
        custom,
    }

    next()
}
