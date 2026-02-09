import { uploadController, updateVideoController, deleteVideoController, likeController, disLikeController } from '../Controller/video.controller.js'
// import ownerMiddleware from '../middleWares/ownerMiddleware.js'

import express from 'express'
import authMiddleware from '../middleWares/authMiddleware.js'
const videoRouter = express.Router()

videoRouter.post('/upload',authMiddleware, uploadController)
videoRouter.put('/:id', authMiddleware, updateVideoController)
videoRouter.delete('/:id', authMiddleware, deleteVideoController)
videoRouter.put('/like/:id', authMiddleware, likeController)
videoRouter.put('/dislike/:id', authMiddleware, disLikeController)


export default videoRouter