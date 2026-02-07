import express from 'express'
import signupController from '../Controller/signup.controller.js'
import loginController from '../Controller/login.controller.js'

const userRouter = express.Router()

userRouter.post('/signup', signupController)
userRouter.post('/login', loginController)


export default userRouter

