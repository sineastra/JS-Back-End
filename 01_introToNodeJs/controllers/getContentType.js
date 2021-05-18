const fs = require('fs')

const getContentType = (url) => {
	const splitArr = url.split('.').filter(x => x !== '')
	const extension = splitArr[splitArr.length - 1]

	switch (extension) {
		case 'css':
			return 'text/css'
		case 'html' || 'htm' :
			return 'text/html'
		case 'jpg':
			return 'image/jpeg'
		case 'js':
			return 'text/javascript'
		case 'png':
			return 'image/png'
	}
}

module.exports = (req, res) => {
	const url = `..${req.url}`
	fs.readFile(url, (e, content) => {
		console.log("CONTENT --------------------------" + content)
		res.writeHead(200, { 'Content-Type': getContentType(url) })
		res.write(content, 'utf-8')
		res.end()
	})
}