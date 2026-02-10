import { uploadController, updateVideoController, deleteVideoController, getAllVideos, getVideoById } from '../Controller/video.controller.js'
import ownerMiddleware from '../middleWares/ownerMiddleware.js'

import express from 'express'
import authMiddleware from '../middleWares/authMiddleware.js'

const videoRouter = express.Router()

videoRouter.get("/", getAllVideos);
videoRouter.get("/:id", getVideoById);

videoRouter.post('/upload',authMiddleware, ownerMiddleware, uploadController)
videoRouter.put('/:id', authMiddleware, ownerMiddleware, updateVideoController)
videoRouter.delete('/:id', authMiddleware, ownerMiddleware, deleteVideoController)


export default videoRouter