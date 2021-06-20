const router = require('express').Router()
const { usersOnly } = require('../middlewares/routeGuards.js')

router.get('/details/:id', usersOnly)