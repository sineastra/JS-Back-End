const handlers = {}

const matcher = (url) => {
	if (url.startsWith('/content'))
		return handlers['/content']

	if (url === '/')
		return handlers['/'] || defaultHandler

	const handler = (Object.entries(handlers)
		.find(([key, value]) => url.startsWith(key) && key !== '/') || [])[1]

	return handler ? handler : defaultHandler
}

const registerHandler = (url, handler) => handlers[url] = handler

const defaultHandler = (req, res) => {
	res.statusCode = 404
	res.write('<div>NOT FOUND</div>')
	res.end()
}

module.exports = {
	registerHandler,
	matcher
}
