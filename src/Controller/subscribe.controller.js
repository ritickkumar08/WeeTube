import jwt from 'jsonwebtoken'
import User from '../Models/user.model.js'

const subscribeController = async (req, res) => {
    try {
        const { channelId } = req.body;          // extracting channelId from request body
        const { id } = req.user;                 // extracting logged-in user id from auth middleware

        // preventing user from subscribing to their own channel
        if (id === channelId) {
        return res.status(400).json({
            message: "You cannot subscribe to your own channel.",
        });
        }

        const user = await User.findById(id); // fetching user from database
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        // checking if the channel is already in subscribedChannels array
        const isAlreadySubscribed = user.subscribedChannels.includes(channelId);

        let update;           // mongo update query holder
        let statusMessage;    // response message holder

        if (isAlreadySubscribed) {
        // unsubscribe case: removing channelId from subscribedChannels
        update = { $pull: { subscribedChannels: channelId } };
        statusMessage = "Channel removed from Subscription";
        } else {
        // subscribe case: adding channelId only if not already present
        update = { $addToSet: { subscribedChannels: channelId } };
        statusMessage = "Channel is subscribed";
        }

        // updating user and returning fresh populated user document
        const updatedUser = await User
        .findByIdAndUpdate(id, update, { new: true }) // applying subscription update
        .populate({
            path: "likedVideos",
            populate: { path: "channel uploader", select: "channelName username avatar" },
        }) // populating liked videos with channel & uploader
        .populate({
            path: "dislikedVideos",
            populate: { path: "channel uploader", select: "channelName username avatar" },
        }) // populating disliked videos with channel & uploader
        .populate("channel") // populating user's own channel
        .populate("subscribedChannels") // populating subscribed channels
        .populate({
            path: "watchLater",
            populate: { path: "channel uploader", select: "channelName username avatar" },
        }) // populating watch later videos
        .populate({
            path: "watchHistory.video",
            populate: { path: "channel uploader", select: "channelName username avatar" },
        }); // populating watch history videos

    // sending final response with subscription status and updated user
    res.status(200).json({
        message: statusMessage,
        subscribed: !isAlreadySubscribed,
        user: updatedUser,
    }); 
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'something went wrong'})
    }
}

export default subscribeController