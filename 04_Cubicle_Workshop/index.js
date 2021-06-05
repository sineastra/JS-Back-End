const express = require('express')
const hbs = require('express-handlebars')
const { dbInit } = require('./database/database-controllers')
const { createCubeGet, createCubePost } = require('./controllers/createCube')
const home = require('./controllers/home')
const about = require('./controllers/about')
const details = require('./controllers/details')
const { createAccessoryGet, createAccessoryPost } = require('./controllers/createAccessory')

const app = express()
const port = 3000

app.engine(
	'.hbs',
	hbs({
		extname: '.hbs',
	})
)

start()

async function start () {
	app.set('view engine', '.hbs')
	app.use(express.static('static'))
	app.use(express.urlencoded({ extended: false }))
	app.use(await dbInit())

	app.get('/', home)
	app.get('/about', about)
	app.get('/create/cube', createCubeGet)
	app.post('/create/cube', createCubePost)
	app.get('/details/:id', details)
	app.get('/create/accessory', createAccessoryGet)

	app.all('*', (req, res) => {
		res.render('404')
	})

	app.listen(port, () => console.log(`Server started on port ${port}`))
}
