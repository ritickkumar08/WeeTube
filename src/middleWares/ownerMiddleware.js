import Video from '../Models/video.model.js'
import Channel from '../Models/channel.model.js'

const ownerMiddleware = async (req, res, next) =>{
    try {
        // extracting authenticated user id and normalizing it to string
    const userId = req.user.id.toString();

    // checking if request has a video id (update / delete case)
    if (req.params.id) {
        // fetching the video using id from route params
        const video = await Video.findById(req.params.id);

        // stopping request if video does not exist
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // fetching the channel linked to the video
        const channel = await Channel.findById(video.channel);

        // verifying that the logged-in user owns the channel
        if (!channel || channel.owner.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action on this video", });
        }

    } else {
        // create video case: checking if user already owns a channel
        const channel = await Channel.findOne({ owner: userId });

        // blocking upload if user does not have a channel
        if (!channel) {
            return res.status(400).json({ message: "You must create a channel to upload videos", });
        }

        // attaching channel id to request for use in controller
        req.channelId = channel._id;
    }

    // passing control to next middleware/controller
    next();
    } catch (err) {
        res.status(500).json({ message: "Server Error during ownership check", error: error.message });
    }
}

export default ownerMiddleware