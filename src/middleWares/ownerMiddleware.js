import Video from '../Models/video.model.js'

const ownerMiddleware = async (req, res, next) =>{
    try {
        const userId = req.user.id.toString()
        // console.log(userId);

        if(req.params.id){
            //to Update or Delete operation: Check if video belongs to a channel owned by user
            const video = await Video.findById(req.params.id);
            // console.log(video);
            if (!video) {
                return res.status(404).json({ message: "Video not found" });
            }

            if (video.userId.toString() !== userId) {
                return res.status(403).json({ message: "You are not authorized to perform this action on this video" });
            }

            req.video = video
            console.log(req.video);
            
        }
        
        next()
    } catch (err) {
        res.status(500).json({ message: "Server Error during ownership check", error: error.message });
    }
}

export default ownerMiddleware