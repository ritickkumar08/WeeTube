import express from 'express'
import authMiddleware from '../middleWares/authMiddleware.js'
import likeController, { dislikeController } from '../Controller/likes.controller.js'
import subscribeController from '../Controller/subscribe.controller.js'

const otherRouter = express.Router()

otherRouter.post('/likes', authMiddleware, likeController)
otherRouter.post('/likes', authMiddleware, dislikeController)
otherRouter.post('/subscribe', subscribeController)