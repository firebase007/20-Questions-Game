/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable radix */
/* eslint-disable no-tabs */
import moment from 'moment'

import dbQuery from '../db/dbQuery'

import {
	generateJWT, hashPassword,
} from '../helpers/utils'

import {
	comparePassword,
	isValidEmail,
	validatePassword,
	isEmpty,
} from '../helpers/validation'

import {
	sendResponse, sendErrorResponse,
} from '../helpers/response'

/**
   * Register New User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const registerUser = async (req, res) => {
	const {
		email, firstName, lastName, password,
	} = req.body

	const createdOn = moment(new Date())

	if (!isValidEmail(email)) {
		return sendErrorResponse({
			res,
			message: 'Please enter a valid Email address',
			statusCode: 400,
		})
	}

	if (!validatePassword(password)) {
		return sendErrorResponse({
			res,
			message: 'Password must be more than five(5) characters',
			statusCode: 400,
		})
	}

	const hashedPassword = hashPassword(password)

	const createUserQuery = `INSERT INTO
      users(email, firstName, lastName, password, createdOn)
      VALUES($1, $2, $3, $4, $5)
      returning *`

	const values = [
		email,
		firstName,
		lastName,
		hashedPassword,
		createdOn,
	]

	try {
		const { rows } = await dbQuery.query(createUserQuery, values)
		const dbResponse = rows[0]
		delete dbResponse.password
		return sendResponse({
			res,
			responseBody: { user: dbResponse },
			statusCode: 201,
			message: 'User successfully created',
		})
	} catch (error) {
		console.log(error, 'error')
		return sendErrorResponse({
			res,
			message: error,
			statusCode: 500,
		})
	}
}

/**
   * login User
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
const loginUser = async (req, res) => {
	const { email, password } = req.body

	if (isEmpty(email) || isEmpty(password)) {
		return sendErrorResponse({
			res,
			message: 'Email or Password detail is missing',
			statusCode: 400,
		})
	}

	if (!isValidEmail(email) || !validatePassword(password)) {
		return sendErrorResponse({
			res,
			message: 'Please enter a valid Email or Password',
			statusCode: 400,
		})
	}

	const loginUserQuery = 'SELECT * FROM users WHERE email = $1'

	try {
		const { rows } = await dbQuery.query(loginUserQuery, [email])

		const dbResponse = rows[0]

		if (!dbResponse) {
			return sendErrorResponse({
				res,
				message: 'User with this email does not exist',
				statusCode: 400,
			})
		}
		if (!comparePassword(dbResponse.password, password)) {
			return sendErrorResponse({
				res,
				message: 'The password you provided is incorrect',
				statusCode: 400,
			})
		}

		const token = generateJWT(dbResponse)
		const refreshExpiry = moment().utc().add(3, 'days').endOf('day')
			.format('X')
		const refreshtoken = generateJWT({ exp: parseInt(refreshExpiry), data: dbResponse._id })
		delete dbResponse.password
		return sendResponse({
			res,
			responseBody: { user: dbResponse, token, refresh: refreshtoken },
			message: 'login successful',
		})
	} catch (error) {
		console.log(error)
		return sendErrorResponse({
			res,
			message: error,
			statusCode: 500,
		})
	}
}

const me = async (req, res) => {
	console.log(res.user, '-----------------')
	try {
		return sendResponse({
			res,
			message: 'User details successfully fetched',
			responseBody: {
				firstName: res.user.firstname,
				email: res.user.email,
				lastName: res.user.lastname,
				token: res.token,
				id: res.user.id,
			},
		})
	} catch (error) {
		console.log(error)
		return sendErrorResponse({
			res,
			message: 'Unable to fetch currently logged in user detail',
			statusCode: 400,
		})
	}
}

export {
	registerUser,
	loginUser,
	me,
}
