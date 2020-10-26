/* eslint-disable indent */
import express from 'express'

import { registerUser, loginUser, me } from '../controller/users'

import {
 createUser,
} from '../helpers/validation'

import {
  authenticate, decodeHeader,
 } from '../middleware/verifyAuth'

const router = express.Router()

// user Routes
router.post('/auth/signup', createUser, registerUser)
router.post('/auth/login', loginUser)
router.get('/me', decodeHeader, me)

export default router
