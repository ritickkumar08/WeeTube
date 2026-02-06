import mongoose from 'mongoose'

const channelSchema = new mongoose.Schema({
    channelName:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        defalut: ""
    },
    banner:{
        type: String,
        default: ""
    },
    subscribers:{
        type: Number,
        default:0
    },
    channelOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    },
    { timestamps: true }
)

export default mongoose.model('Chennel', channelSchema)