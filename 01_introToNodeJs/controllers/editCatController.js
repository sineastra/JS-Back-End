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
	const currentCat = cats.find(x => x._id === catId) || {}

	if (req.method === 'GET') {
		fs.readFile('../views/editCat.html', (e, content) => {
			const currentBreeds = breeds.map(x =>
					`<option ${x === currentCat.breed ? 'selected' : ''} value="${x}">${x}</option>`)
				.join('')
			const modifiedContent = content.toString()
				.replace('{{breeds}}', currentBreeds)
				.replace('{{name}}', currentCat.name)
				.replace('{{description}}', currentCat.description)

			res.writeHead(200, { 'Content-TYpe': 'text/html' })
			res.write(modifiedContent, 'utf-8')
			res.end()
		})
	} else if (req.method === 'POST') {
		const form = new formidable.IncomingForm()

		form.parse(req, (err, fields, files) => {
			if (fields.name && fields.description && fields.breed) {
				let imageName = currentCat.image

				if (files.upload.name !== '') {
					fs.unlink(`D:\\JavaScript\\softUni_September_2020\\JS Back End\\01_introToNodeJs\\content\\images\\${imageName}`,
						(err) => {})
					imageName = `${fields.name.replace(/ /gm, '_')}.jpg`
					const newPath = `D:\\JavaScript\\softUni_September_2020\\JS Back End\\01_introToNodeJs\\content\\images\\${imageName}`

					mv(files.upload.path, newPath, (err) => {
						if (err) throw err
					})
				}

				const newCats = cats.map(x => x._id === catId
					? { _id: catId, ...fields, image: imageName, }
					: x)


				fs.writeFile('../database/cats.json',
					JSON.stringify(newCats), () => {})

				res.writeHead(302, {
					'Location': '/'
				})

				console.log('almost')
				res.end()
			}
		})
	}
}