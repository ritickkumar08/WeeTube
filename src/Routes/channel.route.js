import express from 'express'
import { createChannel, deleteChannel, getAllChannels, getChannelById, updateChannel } from '../Controller/channel.controller';
import authMiddleware from '../middleWares/authMiddleware'

const channelRouter = express.Router()

//accessible without any authrization
channelRouter.use('/', getAllChannels)
channelRouter.get("/:id", getChannelById);

// Protected routes
// Routes that require user authentication
channelRouter.post("/", authMiddleware, createChannel);
channelRouter.put("/:id", authMiddleware, updateChannel);
channelRouter.delete("/:id", authMiddleware, deleteChannel);

export default channelRouter;