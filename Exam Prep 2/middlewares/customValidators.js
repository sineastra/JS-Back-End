const doPasswordsMatch = (value, req) => {
	if (value !== req.body.rePassword) {
		throw new Error('Password confirmation does not match password')
	}

	return true
}

const isUsernameTaken = async (username, req) => {
	const existingUsername = await req.dbServices.user.getByUsername(username)

	return existingUsername
		? Promise.reject('Username already exists!')
		: Promise.resolve('Username does not exist!')
}

module.exports = (req, res, next) => {
	req.customValidators = {
		doPasswordsMatch,
		isUsernameTaken,
	}

	next()
}