import express from 'express'
import signupController from '../Controller/signup.controller.js'

const userRouter = express.Router()

userRouter.post('/signup', signupController)


export default userRouter

