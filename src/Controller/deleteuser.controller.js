import User from "../Models/user.model.js";
import Channel from "../Models/channel.model.js";
import Video from "../Models/video.model.js";

const deleteUserController = async (req, res) => {
  try {
    // getting authenticated user id from auth middleware
    const userId = req.user.id;

    // finding the channel owned by this user (if any)
    const channel = await Channel.findOne({ owner: userId });

    // if the user owns a channel, clean up related data
    if (channel) {
      // deleting all videos uploaded under this channel
      await Video.deleteMany({ channel: channel._id });

      // deleting the channel document itself
      await Channel.findByIdAndDelete(channel._id);
    }

    // deleting the user account from database
    const deletedUser = await User.findByIdAndDelete(userId);

    // if user was not found, return proper response
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // sending success response after full cleanup
    res.status(200).json({
      message: "Account and associated data deleted successfully",
    });

  } catch (err) {
    // logging error for debugging purposes
    console.error("Error deleting user:", err);

    // sending generic server error response
    res.status(500).json({ message: "Internal server error during deletion" });
  }
};

export default deleteUserController;
