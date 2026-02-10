import userModel from "../../models/userModel.js";
import videoModel from "../../models/videoModel.js";

//  ADD / UPDATE WATCH HISTORY
async function setWatchHistory(req, res) {
  try {
    // extracting video id from request body
    const { videoId } = req.body;

    // extracting authenticated user id from auth middleware
    const { id } = req.user;

    // validating video id presence
    if (!videoId) {
      return res.status(400).json({
        message: "Video ID is required",
      });
    }

    // fetching user from database
    const user = await userModel.findById(id);

    // returning error if user does not exist
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // checking if the video already exists in watch history
    const existingEntry = user.watchHistory.find(
      (entry) => entry.video.toString() === videoId
    );

    if (existingEntry) {
      // updating watched timestamp if video already exists in history
      existingEntry.watchedAt = new Date();

      // saving updated user document
      await user.save();
    } else {
      // pushing new video entry into watch history
      user.watchHistory.push({
        video: videoId,
        watchedAt: new Date(),
      });

      // saving user with new watch history entry
      await user.save();

      // incrementing video views only on first watch
      await videoModel.findByIdAndUpdate(videoId, {
        $inc: { views: 1 },
      });
    }

    // fetching full updated user with populated fields for frontend sync
    const fullUser = await userModel.findById(id)
      .populate({
        path: "likedVideos",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      })
      .populate({
        path: "dislikedVideos",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      })
      .populate("channel")
      .populate("subscribedChannels")
      .populate({
        path: "watchLater",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      })
      .populate({
        path: "watchHistory.video",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      });

    // sending success response with updated watch history and user
    res.status(200).json({
      message: "Watch history updated successfully",
      watchHistory: fullUser.watchHistory,
      user: fullUser,
    });

  } catch (error) {
    // logging error for debugging
    console.error("Watch History Error:", error);

    // sending server error response
    res.status(500).json({
      message: "Error updating watch history",
      error: error.message,
    });
  }
}



//   REMOVE FROM WATCH HISTORY
async function removeFromWatchHistory(req, res) {
  try {
    // extracting video id from request body
    const { videoId } = req.body;

    // extracting authenticated user id
    const { id } = req.user;

    // validating video id presence
    if (!videoId) {
      return res.status(400).json({
        message: "Video ID is required",
      });
    }

    // removing the video entry from user's watch history
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $pull: { watchHistory: { video: videoId } } }, // removing matching video entry
      { new: true } // returning updated document
    )
      .populate({
        path: "watchHistory.video",
        select: "title thumbnailUrl views category duration createdAt",
      })
      .populate("likedVideos")
      .populate("dislikedVideos")
      .populate("channel")
      .populate("subscribedChannels")
      .populate({
        path: "watchLater",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      });

    // returning error if user does not exist
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // sending success response with updated user
    res.status(200).json({
      message: "Video removed from watch history",
      user: updatedUser,
    });

  } catch (error) {
    // logging error for debugging
    console.error("Remove Watch History Error:", error);

    // sending server error response
    res.status(500).json({
      message: "Error removing from watch history",
      error: error.message,
    });
  }
}

// exporting controllers
export default setWatchHistory;
export { removeFromWatchHistory };






