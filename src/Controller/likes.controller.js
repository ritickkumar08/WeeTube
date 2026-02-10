import User from '../Models/user.model.js'
import Video from '../Models/video.model.js'

const likeController = async (req, res) => {
  try {
    const { videoId } = req.body;
    const userId = req.user.id;

    // 1. validate video
    const video = await Video.findById(videoId);
    if (!video) {
        return res.status(404).json({ message: "Video not found" });
    }

    // 2. get only required user fields
    const user = await User
      .findById(userId)
      .select("likedVideos dislikedVideos");

    const isLiked = user.likedVideos.includes(videoId);
    const isDisliked = user.dislikedVideos.includes(videoId);

    // 3. USER UPDATE
    const userUpdate = isLiked
      ? { $pull: { likedVideos: videoId } }
      : {
          $addToSet: { likedVideos: videoId },
          $pull: { dislikedVideos: videoId },
        };

    await User.findByIdAndUpdate(userId, userUpdate);

    // 4. VIDEO UPDATE (safe counts)
    const videoUpdate = isLiked
      ? { $inc: { likes: -1 } }
      : {
          $inc: {
            likes: 1,
            ...(isDisliked && { dislikes: -1 }),
          },
        };

    await Video.findByIdAndUpdate(videoId, videoUpdate);

    return res.status(200).json({ message: isLiked ? "Like removed" : "Video liked" });
  } catch (err) {
    return res.status(500).json({
      message: "Like toggle failed",
      error: err,
    });
  }
};

export default likeController;

export const dislikeController = async (req, res) => {
  try {
    // extracting videoId from request body
    const { videoId } = req.body;

    // extracting logged-in user id from auth middleware
    const userId = req.user.id;

    // validating that the video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // fetching only required user fields to keep query fast
    const user = await User
      .findById(userId)
      .select("likedVideos dislikedVideos");

    // checking if the video is already disliked by the user
    const isDisliked = user.dislikedVideos.includes(videoId);

    // checking if the video was previously liked
    const isLiked = user.likedVideos.includes(videoId);

    // preparing user update query
    const userUpdate = isDisliked
      // removing dislike if already disliked
      ? { $pull: { dislikedVideos: videoId } }
      // adding dislike and removing like if present
      : {
          $addToSet: { dislikedVideos: videoId },
          $pull: { likedVideos: videoId },
        };

    // applying user update
    await User.findByIdAndUpdate(userId, userUpdate);

    // preparing safe video counter update
    const videoUpdate = isDisliked
      // decrementing dislikes if dislike removed
      ? { $inc: { dislikes: -1 } }
      // incrementing dislikes and decrementing likes only if needed
      : {
          $inc: {
            dislikes: 1,
            ...(isLiked && { likes: -1 }),
          },
        };

    // applying video counter update
    await Video.findByIdAndUpdate(videoId, videoUpdate);

    // sending final response
    return res.status(200).json({
      message: isDisliked ? "Dislike removed" : "Video disliked",
    });
  } catch (err) {
    // handling unexpected server errors
    return res.status(500).json({
      message: "couldn't dislike",
      error: err,
    });
  }
};