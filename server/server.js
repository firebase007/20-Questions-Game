/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-tabs */
import express from 'express'
import 'babel-polyfill'
import cors from 'cors'
import usersRoute from './app/route/user'

import Utils from './app/helpers/utils'

const app = express()

const message = []

// Add  cors middleware
app.use(cors())

// Add middleware for parsing JSON and urlencoded data
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api/v1', usersRoute)

app.get('/', (req, res) => {
	res.status(200).send('Welcome to the Questions Game App')
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found')
	console.log(err)
	err.status = 404
	res.send('Route not found')
	next(err)
})

const server = app.listen(process.env.APP_PORT).on('listening', () => {
	console.log(`App live and listening on port: ${process.env.APP_PORT}`)
})

const io = require('socket.io')(server)

const rooms = {}
const users = {}

io.use(async (socket, next) => {
	try {
		const { token } = socket.handshake.query
		const payload = Utils.verifyJWT(token)
		console.log(payload, 'payload from client')
		if (!payload) return next(new Error('Authentication error'))
		socket.user = payload
		next()
	} catch (err) {
		console.log(err)
	}
}).on('connection', (socket) => {
	const userId = socket.user.id
	console.log(userId, 'userId')
	// socket.on('SEND_GUESS', (data) => {
	// 	console.log(data, 'oololp')
	// 	// console.log({ data, room: socket.rooms, id: userId }, 'data')
	// 	// io.emit('GUESS', { data, room: socket.rooms, id: userId })
	// 	// io.to(socket.rooms).emit('GUESS')
	// })

	console.log(`Socket ${socket.id} connected.`)

	// socket.join(socket.id)

	socket.on('join', (data) => {
		console.log(data, 'room')
		socket.join(data)
		// rooms[userId] = data
		// console.log(rooms)
	})

	socket.on('SEND_MESSAGE', (data) => {
		console.log(data, 'data')
		io.emit('MESSAGE', { data, room: socket.id, id: userId })
	})

	socket.on('connected', (user) => {
		users[userId] = user
		io.emit('users', users)
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
		delete users[userId]
		io.emit('users', users)
	})
})

export default app
