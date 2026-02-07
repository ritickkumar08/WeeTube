import User from '../Models/user.model'

const myProfileController = async (req, res) => {
    try{
        const user = await User.findById(req.user._id)
        .select( "username email avatarUrl avatarId channel subscribedChannels watchLater" )
        .populate('channel','channelName avatar')
        .populate('subscribedChannels', 'channelName avatar')
        .populate({
            path: "watchLater",
            options: { limit: 20 },
            populate: [
            { path: "channel", select: "channelName avatar" },
            { path: "uploader", select: "username avatar" },
            ],
        })

        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        // Ensure 'id' property is available for frontend compatibility
        const userData = user.toObject();
        userData.id = user._id;

        res.status(200).json(userData);
    }catch(err){
        //a over all catch for all and any errors we get during try block.
        console.log("Login error:", err);
        res.status(500).json({error: err})
    }
}

export default myProfileController