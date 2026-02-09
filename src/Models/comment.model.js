import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Video'
    },
    commentText:{
        type: String,
        required: true
    }
    },
    {timestamps: true}
)

export default mongoose.model('Comment', commentSchema)