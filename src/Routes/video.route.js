import { uploadController } from '../Controller/video.controller.js'

import express from 'express'
import authMiddleware from '../middleWares/authMiddleware.js'
const videoRouter = express.Router()

videoRouter.post('/upload',authMiddleware, uploadController)

export default videoRouter