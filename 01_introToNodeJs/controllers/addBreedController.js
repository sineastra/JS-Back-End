const fs = require('fs')
const qs = require('querystring')
let breeds = require('../database/breeds.json')

module.exports = (req, res) => {
	if (req.method === 'GET') {
		fs.readFile('../views/addBreed.html', (e, content) => {
			res.writeHead(200, { 'Content-TYpe': 'text/html' })
			res.write(content, 'utf-8')
			res.end()
		})
	} else if (req.method === 'POST') {
		let body = ''

		req.on('data', (data) => {
			body += data
		})
		req.on('end', () => {
			const postData = qs.parse(body)
			if (postData.breed !== '') {
				breeds.push(postData.breed)

				fs.writeFile('../database/breeds.json',
					JSON.stringify(breeds), () => {console.log(breeds)})

				res.writeHead(302, {
					'Location': '/'
				})
				res.end()
			}
		})
	}
}