import express from 'express'

import { addComment, allComments, editComment, deleteComment } from '../Controller/comment.controller.js'
import authMiddleware from '../middleWares/authMiddleware.js'


const commentRouter = express.Router()

// Add a new comment
commentRouter.post('/new-comment/:id', authMiddleware, addComment)

// Get comments for a specific video
commentRouter.get('/:id', allComments)
//edit a comment
commentRouter.put('/:id', authMiddleware, editComment)
//delete a comment
commentRouter.delete('/:id', authMiddleware, deleteComment)


export default commentRouter