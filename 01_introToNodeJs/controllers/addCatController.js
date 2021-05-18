const fs = require('fs')
const qs = require('querystring')
const cats = require('../database/cats.json')
const breeds = require('../database/breeds.json')
const formidable = require('formidable')
const mv = require('mv')

module.exports = (req, res) => {
	if (req.method === 'GET') {
		fs.readFile('../views/addCat.html', (e, content) => {
			const currentBreeds = breeds.map(x => `<option value="${x}">${x}</option>`).join('')
			const modifiedContent = content.toString().replace('{{breeds}}', currentBreeds)

			res.writeHead(200, { 'Content-TYpe': 'text/html' })
			res.write(modifiedContent, 'utf-8')
			res.end()
		})
	} else if (req.method === 'POST') {
		const form = new formidable.IncomingForm()

		form.parse(req, (err, fields, files) => {
			if (fields.name && fields.description && fields.breed && files.upload.name) {
				const catCopy = cats.slice()
				const newName = `${fields.name}.jpg`
				const newPath = `D:\\JavaScript\\softUni_September_2020\\JS Back End\\01_introToNodeJs\\content\\images\\${newName}`

				mv(files.upload.path, newPath, (err) => {
					if (err) throw err
				})
				catCopy.push({
					_id: Math.random().toString(36).substr(2, 9),
					...fields,
					image: newName
				})

				fs.writeFile('../database/cats.json',
					JSON.stringify(catCopy), () => {})

				res.writeHead(302, {
					'Location': '/'
				})
				res.end()
			}
		})
	}
}