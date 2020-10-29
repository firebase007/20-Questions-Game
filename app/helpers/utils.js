/* eslint-disable no-tabs */
import bcrypt from 'bcryptjs'

const jwt = require('jsonwebtoken')
const fs = require('fs')

const privateKEY = fs.readFileSync('./private.key', 'utf8')
const publicKEY = fs.readFileSync('./public.key', 'utf8')

const i = 'questions-game'
const s = 'questions-game'
const a = 'questions-game'

const verifyOptions = {
	issuer: i,
	subject: s,
	audience: a,
	expiresIn: '8784h',
	algorithm: ['RS256'],
}

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

module.exports = {

	generateJWT(payload) {
		const signOptions = {
			issuer: i,
			subject: s,
			audience: a,
			expiresIn: '8784h',
			algorithm: 'RS256',
		}

		const options = signOptions
		if (payload && payload.exp) {
			delete options.expiresIn
		}
		return jwt.sign(payload, privateKEY, options)
	},

	verifyJWT(payload) {
		return jwt.verify(payload, publicKEY, verifyOptions)
	},

	hashPassword(password) {
		const hash = bcrypt.hashSync(password, salt)
		return hash
	},

}
