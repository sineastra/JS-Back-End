const fs = require('fs')

const catTemplate = ({ _id, image, breed, description, name }) => `
<li>
<img src="/content/images/${image}" alt="cat image">
<h3>${name}</h3>
<p><span>Breed: </span>${breed}</p>
<p><span>Description: </span>${description}</p>
<ul class="buttons">
<li class="btn edit"><a href="/edit/${_id}">Change Info</a></li>
<li class="btn delete"><a href="/">New Home</a></li>
</ul>
</li>`


module.exports = (req, res) => {
	const cats = JSON.parse(fs.readFileSync('../database/cats.json', 'utf-8'))
	console.log('cats --------------------' + cats)

	fs.readFile('../views/home/index.html', (e, content) => {
		res.writeHead(200, { 'Content-TYpe': 'text/html' })
		res.write(content.toString().replace('{{catsInfo}}', cats.map(catTemplate)), 'utf-8')
		res.end()
	})
}