import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        default: ""
    },
    videoUrl:{
        type: String,
        required: true
    },
    videoId:{
        type: String,
        required: true,
    },
    thumbnailUrl:{
        type: String,
        required: true
    },
    thumbnailId:{
        type: String,
        required: true
    },
    category:{
        type: String,
    },
    tags:[{
        type: String
    }],
    views:{
        type: String,
        default: 0
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel", // The channel this video belongs to
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user who uploaded the video
      required: true,
    },
    },
    {timestamps: true}
)

export default mongoose.model('Video', videoSchema)