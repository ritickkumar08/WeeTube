import express from 'express'
import signupController from '../Controller/signup.controller.js'
import loginController from '../Controller/login.controller.js'
import myProfileController from '../Controller/myProfile.controller.js'
import authMiddleware from '../middleWares/authMiddleware.js'
import subscribeController from '../Controller/subscribe.controller.js'

const userRouter = express.Router()

userRouter.post('/signup', signupController)
userRouter.post('/login', loginController)
userRouter.post('/me',authMiddleware, myProfileController)
userRouter.put('/subscribe/:id',authMiddleware, subscribeController)


export default userRouter

