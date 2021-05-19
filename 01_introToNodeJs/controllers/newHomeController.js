const fs = require('fs')
const qs = require('querystring')
let cats = require('../database/cats.json')
const breeds = require('../database/breeds.json')
const formidable = require('formidable')
const url = require('url')
const mv = require('mv')

module.exports = (req, res) => {
	const urlParts = url.parse(req.url, true)
	const query = urlParts.query
	const catId = query.id
	const currentCatIndex = cats.findIndex(x => x._id === catId)
	const currentCat = cats[currentCatIndex] || {}

	if (req.method === 'GET') {
		fs.readFile('../views/catShelter.html', (e, content) => {
			const currentBreeds = breeds.map(x =>
					`<option ${x === currentCat.breed ? 'selected' : ''} value="${x}">${x}</option>`)
				.join('')
			const modifiedContent = content.toString()
				.replace('{{image}}', currentCat.image)
				.replace('{{breeds}}', currentBreeds)
				.replace('{{name}}', currentCat.name)
				.replace('{{description}}', currentCat.description)

			res.writeHead(200, { 'Content-TYpe': 'text/html' })
			res.write(modifiedContent, 'utf-8')
			res.end()
		})
	} else if (req.method === 'POST') {
		cats.splice(currentCatIndex, 1)

		fs.writeFile('../database/cats.json',
			JSON.stringify(cats), () => {})

		res.writeHead(302, {
			'Location': '/'
		})

		res.end()
	}
}