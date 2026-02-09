import Video from '../Models/video.model.js'

// Controller to increment video views safely and atomically
const viewsController = async (req, res) => {
    try {
        // Find the video by ID and increment its views by 1 in a single atomic operation
        // $inc ensures no race conditions when multiple users hit this endpoint together
        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,   // Video ID coming from the URL (/video/:id)
            { $inc: { views: 1 } },  // MongoDB atomic increment operator
            { new: true } // Return the updated document after increment
        );

        // If no video was found with the given ID, return a 404 instead of crashing
        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Respond with ok
        res.status(200).json({message : 'ok'})
    } catch (err) {
        console.log(err);
        // Send a generic server error response
        return res.status(500).json({error : err, message : 'Failed to update video views'})
    }
}

export default viewsController