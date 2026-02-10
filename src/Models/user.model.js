import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userName:{
      type: String,
      // required: true, //and username will be compulsory
      trim: true,
      maxlength: 30,
      default: ""
    },
    email: {
      type: String,
      required: true,
      unique: true, //emails must be unique
      lowercase: true, // Convert email to lowercase and remove whitespace for consistency
      trim: true, 
    },
    password: {
      type: String,
      required: true,
      select: false,  // Prevent password from being included in query results by default for security
    },
    avatar: {
      type: String,
      default: "",
    },
    subscribedBy:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // List of channels the user has subscribed to
      default: []
    }],

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel", // Reference to the user's own channel
      default: null,
    },
    // Subscribed channels
    subscribedChannels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // List of channels the user has subscribed to
        default: []
      },
    ],
    // Liked videos
    likedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video", // List of videos the user has liked
        default: []
      },
    ],
    dislikedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video", // List of videos the user has disliked
        default: []
      },
    ],

    //watch later
    watchLater: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video", // List of videos saved for later viewing
        default: []
      },
    ],

    // Watch history
    watchHistory: [
      {
        video: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Video", // Reference to a video in the user's watch history
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
        default: []
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema)

