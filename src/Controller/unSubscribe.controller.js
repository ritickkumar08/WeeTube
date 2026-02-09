import jwt from 'jsonwebtoken'
import User from '../Models/user.model.js'

const unSubscribeController = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        //gettint the token from the header and extracting the user details from the token
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // Verify token
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);

        //checking if the channel actually exists
        const channelTobeunSubscribed = await User.findById(req.params.id)
        // console.log(channelTobeSubscribed);
        if (!channelTobeunSubscribed) {
            return res.status(404).json({ message: "Channel not found" });
        }

        //if already a subscriber
        const isSubscribed = channel.subscribedBy.some(
            id => id.toString() === verifiedUser.id
        );

        if (!isSubscribed) {
            return res.status(400).json({ message: "You are not subscribed" });
        }

        //decreasing the subscribers count
        channelTobeunSubscribed.subscribers = Math.max(0, channel.subscribers - 1);
        await channel.save();

        channelTobeunSubscribed.subscribedBy = channelTobeunSubscribed.subscribedBy.filter(userId => userId.toString() != verifiedUser.id)
        await channelTobeunSubscribed.save()
        //the user who is unsubscribing
        const userFullInformation = await User.findById(verifiedUser.id)
        userFullInformation.subscribedChannels = userFullInformation.subscribedChannels.filter(userId => userId.toString() != channelTobeunSubscribed.id)
        await userFullInformation.save()

        res.status(200).json({ message: "unSubscribed" });       
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'something went wrong'})
    }
}

export default unSubscribeController