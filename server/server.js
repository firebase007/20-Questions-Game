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

const users = []

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

	console.log(`Socket session for user: ${socket.user.firstname} with id: ${socket.id} now connected.`)

	socket.on('join', (user) => {
		socket.join('questions')

		socket.broadcast.to('questions').emit('MESSAGE', 'SERVER', `${user} has connected to this room`)
	})

	socket.on('SEND_MESSAGE', (data) => {
		console.log(data, 'data on messagesend')
		// socket.join(socket.id)
		io.emit('MESSAGE', { data, room: socket.id, id: userId })
		// io.sockets.in(socket.id).emit('MESSAGE', data)
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
		delete users[userId]
		io.emit('users', users)
	})
})

export default app
