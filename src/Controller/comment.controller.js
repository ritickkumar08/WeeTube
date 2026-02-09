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


//to get all the comments of the video
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

//to edit the comment
export const editComment = async (req, res) => {
    try {
        // Safely extract Authorization header
        const authHeader = req.headers.authorization
        // Reject if Authorization header is missing
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" })
        }

        // Safely extract token from Authorization header
        const token = authHeader.split(" ")[1]
        // Reject request if token is missing
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }
        // // Verify JWT and extract user payload
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY); 
        // console.log(verifiedUser);

        // Extract new comment text from request body
        const { commentText } = req.body;
        // Validate comment text
        if (!commentText || commentText.trim().length === 0) {
            return res.status(400).json({ message: "Comment text cannot be empty" });
        }

        // Fetch the comment to be edited
        const comment = await Comment.findById(req.params.id);
        // console.log(comment);
        // Handle non-existent comment
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
            
         // Ensure only the comment owner can edit
        if (comment.userId.toString() !== verifiedUser.id) {
            return res.status(403).json({ message: "You are not allowed to edit this comment" });
        }

        // Update comment text
        comment.commentText = commentText.trim();
        // Save updated comment
        const updatedComment = await comment.save();

        res.status(200).json({message: "Comment updated successfully", updatedComment})
    } catch (err) {
        console.log(err);
        //clean error response to client
        return res.status(500).json({error:err, message: 'unable to process request'})
    }
}

//to delete the comment
export const deleteComment = async (req, res) => {
    try {
        // Safely extract Authorization header
        const authHeader = req.headers.authorization
        // Reject if Authorization header is missing
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" })
        }

        // Safely extract token from Authorization header
        const token = authHeader.split(" ")[1]
        // Reject request if token is missing
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }
        // // Verify JWT and extract user payload
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY); 
        // console.log(verifiedUser);

        // Fetch the comment to be edited
        const comment = await Comment.findById(req.params.id);
        // console.log(comment);
        // Handle non-existent comment
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
            
         // Ensure only the comment owner can edit
        if (comment.userId.toString() !== verifiedUser.id) {
            return res.status(403).json({ message: "You are not allowed to delete this comment" });
        }

        // delete comment text
        await Comment.findByIdAndDelete(req.params.id)
        
        res.status(200).json({message: "Comment deleted successfully", updatedComment})
    } catch (err) {
        console.log(err);
        //clean error response to client
        return res.status(500).json({error:err, message: 'unable to process request'})
    }
}