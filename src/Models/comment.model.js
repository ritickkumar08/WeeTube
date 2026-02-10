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
        required: true,
        minlength: 1,
        maxlength: 500,
    }
    },
    {timestamps: true}
)

export default mongoose.model('Comment', commentSchema)