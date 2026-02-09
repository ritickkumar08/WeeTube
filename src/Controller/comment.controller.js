import Video from '../Models/video.model.js';
import Comment from '../Models/comment.model.js'
import jwt from 'jsonwebtoken'

export const addComment = async (req, res) => {
    try {
        // Safely extract token from Authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Reject request if token is missing
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // // Verify JWT and extract user payload
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);   
        
        // Validate comment text
        if (!req.body.commentText || !req.body.commentText.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        // Ensure the video actually exists
        const videoExists = await Video.findById(req.params.id);
        if (!videoExists) {
            return res.status(404).json({ message: "Video not found" });
        }

        const newComment = new Comment({
            videoId: req.params.id,
            userId: verifiedUser.id,
            commentText: req.body.commentText.trim()
        })
        const comment = await newComment.save()

        res.status(200).json({newComment: comment, message: 'comment added'})
    } catch (err) {
        console.log(err);
        // Generic error response for client
        res.status(500).json({error: 'failed to add comment'})
    }
}

export const allComments = async (req,res) => {
    try {
        // Extract video ID from route parameters
        const videoId = req.params.id;

        // Ensure the video exists before fetching comments
        const videoExists = await Video.findById(videoId);
            if (!videoExists) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Fetch comments related to the video
        const comments = await Comment.find({ videoId })
        // Populate limited user info for each comment
        .populate("userId", "channelName logoUrl")
        // Sort comments by newest first
        .sort({ createdAt: -1 });
        
        // Send comments list to client
        res.status(200).json({ totalComments: comments.length, commentList: comments, });
    } catch (err) {
        console.log(err);
        //clean error response to client
        return res.status(500).json({error:err, message: 'unable to load comments'})
    }
}