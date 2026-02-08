import Video from '../Models/video.model.js'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
    cloud_name : 'ds30udzxa', 
    api_key : '243467972227774', 
    api_secret : 'DX0_uVr0JZvtoJtFXessz3LhzZE' // Click 'View API Keys' above to copy your API secret
});


export const uploadController = async(req, res)=>{
    try {
        const { title, description, category ,tags} = req.body;
        const userId = req.user._id.toString();;
        console.log(userId);
        console.log(req.body);
        console.log(req.files.video);
        console.log(req.files.thumbnail);
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


export const updateVideo = async (req, res) => {
    
}