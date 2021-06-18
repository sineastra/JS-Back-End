const express = require('express')
const hbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const { dbInit } = require('./database/database-controllers')
const { loginMw, processToken } = require('./middlewares/auth')

// views
const { createCubeGet, createCubePost } = require('./controllers/createCube')
const home = require('./controllers/home')
const about = require('./controllers/about')
const details = require('./controllers/details')
const { createAccessoryGet, createAccessoryPost } = require('./controllers/createAccessory')
const { attachAccessoryGet, attachAccessoryPost } = require('./controllers/attachAccessory')
const register = require('./controllers/register')
const login = require('./controllers/login')

// bloat
const app = express()
const port = 3000

app.engine(
	'.hbs',
	hbs({
		extname: '.hbs',
		helpers: {
			isNotEmpty: (arr) => {
				return arr.length > 0
			}
		}
	})
)

async function start () {
	app.set('view engine', '.hbs')

	// middleware
	app.use(express.static('static'))
	app.use(express.urlencoded({ extended: false }))
	app.use(cookieParser())
	app.use(processToken)
	app.use(await dbInit())

	// routes
	app.get('/', home)
	app.get('/about', about)
	app.get('/login', loginMw, login.get)
	app.get('/register', register.get)
	app.post('/register', register.post)
	app.get('/create/cube', createCubeGet)
	app.post('/create/cube', createCubePost)
	app.get('/details/:id', details)
	app.get('/create/accessory', createAccessoryGet)
	app.post('/create/accessory', createAccessoryPost)
	app.get('/attach/accessory/:cubeId', attachAccessoryGet)
	app.post('/attach/accessory/:cubeId', attachAccessoryPost)

	app.all('*', (req, res) => {
		console.log(req.user)
		res.render('404')
	})

	app.listen(port, () => console.log(`Server started on port ${port}`))
}

start()
