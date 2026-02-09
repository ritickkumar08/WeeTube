import jwt from 'jsonwebtoken';
import Video from '../Models/video.model.js'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
    cloud_name : 'ds30udzxa', 
    api_key : '243467972227774', 
    api_secret : 'DX0_uVr0JZvtoJtFXessz3LhzZE' // Click 'View API Keys' above to copy your API secret
});

//uploading a video
export const uploadController = async(req, res)=>{
    try {
        const { title, description, category ,tags} = req.body;
        const userId = req.user._id.toString();
        // console.log(userId);
        // console.log(req.body);
        // console.log(req.files.video);
        // console.log(req.files.thumbnail);
        // req.channelId is set by the checkOwner middleware

        const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath,
            { resource_type:'video' })
        const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
        // console.log("video",uploadedVideo);
        // console.log("picture",uploadedThumbnail);
        
        const newVideo = new Video({
            userId,
            title,
            description,
            category,
            tags: tags.split(","),
            videoUrl: uploadedVideo.secure_url,
            videoId: uploadedVideo.public_id,
            thumbnailUrl: uploadedThumbnail.secure_url,
            thumbnailId: uploadedThumbnail.public_id,
        })

        const newUploadedVideoData =  await newVideo.save()

        res.status(200).json({newVideo: newUploadedVideoData})
        // const {title, description, videoUrl,}
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error uploading video", error: err.message });
    }
}

//updating the video details thumbnail or others
export const updateVideoController = async (req, res) => {
    try {
        const { title, description, category ,tags} = req.body;

        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
        // Fetch the video
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });
        // console.log("user", verifiedUser);
        // console.log("video", video);

        // Check ownership
        if (video.userId.toString() !== verifiedUser.id) {
            return res.status(403).json({ error: "You are unauthorized to make changes" });
        }

        // Prepare updated data
        const updatedData = {
        title: title || video.title,
        description: description || video.description,
        category: category || video.category,
        tags: tags ? tags.split(",") : video.tags,
        };

        // If new thumbnail uploaded
        if (req.files?.thumbnail) {
        if (video.thumbnailId) {
            await cloudinary.uploader.destroy(video.thumbnailId);
        }
        const updatedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath);
        updatedData.thumbnailUrl = updatedThumbnail.secure_url;
        updatedData.thumbnailId = updatedThumbnail.public_id;
        }

        // Update video
        const updatedVideoDetails = await Video.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        res.status(200).json({ updatedVideo: updatedVideoDetails });
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Error updating video",error: err})
    }
}

export const deleteVideoController = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
        return res.status(401).json({ message: "No token provided" });
        }
        // Verify token
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
        // Fetch the video
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Check ownership
        if (video.userId.toString() !== verifiedUser.id) {
            return res.status(403).json({ error: "You are unauthorized to make changes" });
        }

        // Delete DB first
        const deletedResponse = await Video.findByIdAndDelete(req.params.id)
        //delete video, thumbnail and data from database.
        await cloudinary.uploader.destroy(video.videoId, { resource_type:'video' })
        await cloudinary.uploader.destroy(video.thumbnailId)
        

        res.status(200).json({ deletedresponse: deletedResponse, message: 'Video deleted successfully' })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating video",error: err })
    }
}

//like API
export const likeController = async (req,res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
        return res.status(401).json({ message: "No token provided" });
        }
        // Verify token
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);

        // Fetch the video
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        //checking if the user has already liked the video
        const alreadyLiked = video.likedBy.some(
            id => id.toString() === verifiedUser.id
        );
        if (alreadyLiked) {
            return res.status(409).json({ message: "Already liked" });
        }

        //checking if the user has already disliked the video
        const alreadyDisliked = video.dislikedBy.some(
            id => id.toString() === verifiedUser.id
        );
        if(alreadyDisliked){
            video.dislikes -= 1
            video.dislikedBy = video.dislikedBy.filter(userID => userID.toString() !== verifiedUser.id)
        }

        video.likes += 1
        video.likedBy.push(verifiedUser.id)

        await video.save()

        res.status(200).json({message: 'liked'})

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating likes",error: err })
    }
}

//dislike API
export const disLikeController = async (req,res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
        return res.status(401).json({ message: "No token provided" });
        }
        // Verify token
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);

        // Fetch the video
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        //checking if the user has already liked the video
        const alreadyLiked = video.likedBy.some(
            id => id.toString() === verifiedUser.id
        );
        if(alreadyLiked){
            video.likes -= 1
            video.likedBy = video.likedBy.filter(userID => userID.toString() !== verifiedUser.id)
        }
        //checking if the user has already disliked the video
        const alreadyDisliked = video.dislikedBy.some(
            id => id.toString() === verifiedUser.id
        );

        if (alreadyDisliked) {
            return res.status(409).json({ message: "Already disliked" });
        }

        video.dislikes += 1
        video.dislikedBy.push(verifiedUser.id)

        await video.save()

        res.status(200).json({message: 'disliked'})

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating dislikes",error: err })
    }
}