import express from 'express'
import signupController from '../Controller/signup.controller.js'
import loginController from '../Controller/login.controller.js'
import myProfileController from '../Controller/myProfile.controller.js'
import authMiddleware from '../middleWares/authMiddleware.js'
import subscribeController from '../Controller/subscribe.controller.js'
import unSubscribeController from '../Controller/unSubscribe.controller.js'
import updateUserController from '../Controller/ updateUser.controller.js'
import deleteUserController from '../Controller/deleteuser.controller.js'

const userRouter = express.Router()

userRouter.post('/signup', signupController)
userRouter.post('/login', loginController)
userRouter.post('/me',authMiddleware, myProfileController)
userRouter.put("/update", authMiddleware, updateUserController);
userRouter.delete("/delete", authMiddleware, deleteUserController);

userRouter.put('/subscribe/:id',authMiddleware, subscribeController)
userRouter.put('/unsubscribe/:id',authMiddleware, unSubscribeController)



export default userRouter

