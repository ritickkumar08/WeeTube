import User from '../Models/user.model.js'
import Channel from '../Models/channel.model.js'

const unSubscribeController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: channelId } = req.params;

        // Check if channel exists
        const channelToBeUnsubscribed = await Channel.findById(channelId);
        if (!channelToBeUnsubscribed) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Check if user is actually subscribed
        const isSubscribed = channelToBeUnsubscribed.subscribedBy.some(
            (subscriberId) => subscriberId.toString() === userId.toString()
        );

        if (!isSubscribed) {
            return res.status(400).json({ message: "You are not subscribed" });
        }

        // Decrease subscribers count and remove user from subscribedBy
        channelToBeUnsubscribed.subscribers = Math.max(0, channelToBeUnsubscribed.subscribers - 1);
        channelToBeUnsubscribed.subscribedBy = channelToBeUnsubscribed.subscribedBy.filter(
            (subscriberId) => subscriberId.toString() !== userId.toString()
        );
        await channelToBeUnsubscribed.save();

        // Remove channel from user's subscribedChannels
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { subscribedChannels: channelId } },
            { new: true }
        )
          .populate("likedVideos")
          .populate("dislikedVideos")
          .populate("channel")
          .populate("subscribedChannels")
          .populate("watchLater")
          .populate("watchHistory.video");

        res.status(200).json({ message: "Unsubscribed", user: updatedUser });       
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'something went wrong'})
    }
}

export default unSubscribeController