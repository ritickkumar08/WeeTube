import express from 'express'

import signupController from '../Controller/signup.controller.js'
import loginController from '../Controller/login.controller.js'
import myProfileController from '../Controller/myProfile.controller.js'
import authMiddleware from '../middleWares/authMiddleware.js'
import updateUserController from '../Controller/ updateUser.controller.js'
import deleteUserController from '../Controller/deleteuser.controller.js'

const userRouter = express.Router()

userRouter.post('/signup', signupController)
userRouter.post('/login', loginController)
userRouter.post('/me',authMiddleware, myProfileController)
userRouter.put("/update", authMiddleware, updateUserController);
userRouter.delete("/delete", authMiddleware, deleteUserController);



export default userRouter

