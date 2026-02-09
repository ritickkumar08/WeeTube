import express from 'express'

import { addComment, allComments } from '../Controller/comment.controller.js'
import authMiddleware from '../middleWares/authMiddleware.js'


const commentRouter = new express.Router()

commentRouter.post('/new-comment/:id', authMiddleware, addComment)
commentRouter.get('/:id', allComments)

export default commentRouter