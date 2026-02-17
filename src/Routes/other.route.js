import express from 'express'
import authMiddleware from '../middleWares/authMiddleware.js'
import likeController, { dislikeController } from '../Controller/likes.controller.js'
import subscribeController from '../Controller/subscribe.controller.js'
import unSubscribeController from '../Controller/unSubscribe.controller.js'
import watchHistory, { removeFromWatchHistory } from '../Controller/watchHistory.controller.js'

const otherRouter = express.Router()

otherRouter.post('/likes', authMiddleware, likeController)
otherRouter.post('/dislikes', authMiddleware, dislikeController)
otherRouter.post('/subscribe', authMiddleware, subscribeController)
otherRouter.post('/unsubscribe', authMiddleware, unSubscribeController)
otherRouter.post('/watchhistory', authMiddleware, watchHistory)
otherRouter.delete('/watchhistory', authMiddleware, removeFromWatchHistory)


export default otherRouter