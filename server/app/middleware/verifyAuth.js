/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
import dotenv from 'dotenv'
import Response from '../helpers/response'
import Utils from '../helpers/utils'

dotenv.config()

/**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */

const authenticate = () => {
	console.log('got here')
	return (req, res, next) => {
		try {
			let token = req.headers['x-access-token'] || req.headers.authorization || req.body.token
			console.log(token, 'token')
			if (!token) throw new Error('No token provided.')
			if (token.startsWith('Bearer ')) token = token.slice(7, token.length)

			if (!token || token === '' || token === 'undefined') throw new Error('No token provided.')

			const user = Utils.verifyJWT(token)

			console.log(user, 'user------')

			if (!user) throw new Error('Failed to authenticate token. ')

			res.user = user.data
			delete user.data.password
			res.token = token
			return next()
		} catch (e) {
			console.log(e, 'error')
			return Response.sendErrorResponse({ res, message: 'Failed to authenticate token', statusCode: 401 })
		}
	}
}

const decodeHeader = (req, res, next) => {
	let token = req.headers['x-access-token'] || req.headers.authorization || req.body.token
	if (!token) {
		return Response.sendErrorResponse({ res, message: 'No token provided', statusCode: 401 })
	}
	if (token.startsWith('Bearer ')) {
		// Remove Bearer from string
		token = token.slice(7, token.length)
		if (!token || token === '') Response.sendErrorResponse({ res, message: 'No token provided', statusCode: 401 })
	}
	const decoded = Utils.verifyJWT(token)
	if (!decoded) Response.sendErrorResponse({ res, message: 'invalid signature', statusCode: 403 })
	console.log(decoded, 'decoded')
	if (decoded) res.user = decoded

	res.token = token
	return next()
}

export { authenticate, decodeHeader }
