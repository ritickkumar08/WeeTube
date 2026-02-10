import Video from '../Models/video.model.js'

// Controller to fetch all videos with channel and uploader info
export const getAllVideos = async (req, res) => {
  try {
    // fetching all videos from database
    const videos = await Video.find()
      .populate("channel", "channelName") // populating channel name for each video
      .populate("uploader", "username avatar") // populating uploader basic details
      .sort({ createdAt: -1 }); // sorting videos by newest first

    // checking if no videos exist in database
    if (videos.length === 0) {
      return res.status(404).json({
        message: "No videos found",
      });
    }

    // sending videos list to frontend
    return res.status(200).json(videos);

  } catch (err) {
    // handling server error
    return res.status(500).json({ message: err, });
  }
};

//uploading a video
export const uploadController = async(req, res)=>{
    try {
        const { title, description, category , tags,videoUrl, thumbnailUrl,} = req.body;
        const userId = req.user._id.toString();
        // console.log(userId);
        // console.log(req.body);
        // console.log(req.files.video);
        // console.log(req.files.thumbnail);
        // req.channelId is set by the checkOwner middleware

        // const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath,
        //     { resource_type:'video' })
        // const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
        // console.log("video",uploadedVideo);
        // console.log("picture",uploadedThumbnail);
        
        const newVideo = new Video({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            category,
            channel: req.channelId,
            uploader: userId,
        })

        const newUploadedVideo =  await newVideo.save()

        res.status(200).json({newVideo: newUploadedVideo})
        // const {title, description, videoUrl,}
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error uploading video", error: err.message });
    }
}

//updating the video details thumbnail or others
export const updateVideoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category , tags, thumbnailUrl} = req.body;

        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Find and update the video by ID
        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            { title, description, thumbnailUrl, category },
            { new: true }
        );

        res.status(200).json(updatedVideo);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Error updating video",error: err})
    }
}

//delete video
export const deleteVideoController = async (req, res, next) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Video deleted successfully' })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating video",error: err })
    }
}

// Controller to fetch a single video's details by its ID
export const getVideoById = async (req, res) => {
  try {
    // extracting video id from route parameters
    const { id } = req.params;

    // fetching video by id and populating related data
    const video = await Video.findById(id)
      .populate("channel", "channelName description subscribers") // populating channel details
      .populate("uploader", "username avatar"); // populating uploader details

    // returning error if video does not exist
    if (!video) {
      return res.status(404).json({ message: "Video not found", });
    }

    // sending video data to frontend
    return res.status(200).json(video);

  } catch (err) {
    // handling server error
    return res.status(500).json({ message: err, });
  }
};
