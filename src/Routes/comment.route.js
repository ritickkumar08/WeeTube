import express from 'express'

import { addComment, allComments, editComment, deleteComment } from '../Controller/comment.controller.js'
import authMiddleware from '../middleWares/authMiddleware.js'


const commentRouter = new express.Router()

commentRouter.post('/new-comment/:id', authMiddleware, addComment)
commentRouter.get('/:id', allComments)
commentRouter.put('/:id', authMiddleware, editComment)
commentRouter.delete('/:id', authMiddleware, deleteComment)


export default commentRouter