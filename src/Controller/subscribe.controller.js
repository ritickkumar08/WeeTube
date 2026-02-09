import jwt from 'jsonwebtoken'
import User from '../Models/user.model.js'

const subscribeController = async (req, res) => {
    try {
        //gettint the token from the header and extracting the user details from the token
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // Verify token
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifiedUser);
        if (verifiedUser.id === req.params.id) {
            return res.status(400).json({ message: "You cannot subscribe to yourself" });
        }

        const channelTobeSubscribed = await User.findById(req.params.id)
        // console.log(channelTobeSubscribed);
        if (!channelTobeSubscribed) {
            return res.status(404).json({ message: "Channel not found" });
        }

        //if already a subscriber
        const alreadySubscribed = channelTobeSubscribed.subscribedBy.some(
            id => id.toString() === verifiedUser.id
        );
        if (alreadySubscribed) {
            return res.status(409).json({ message: "Already subscribed" });
        }

        await Promise.all([
            User.findByIdAndUpdate(
                req.params.id,
                { $inc: { subscribers: 1 },
                $addToSet: { subscribedBy: verifiedUser.id } }
            ),
            User.findByIdAndUpdate(
                verifiedUser.id,
                { $addToSet: { subscribedChannels: req.params.id } }
            )
        ]);

    res.status(200).json({ message: "Subscribed" });
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'something went wrong'})
    }
}

export default subscribeController