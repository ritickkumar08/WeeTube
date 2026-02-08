// Middleware to protect routes by verifying JWT tokens
// Checks for a valid token in the 'Authorization' header
// Decodes the token to identify the user
// Fetches the user from the database to ensure they exist
// Attaches the user object to the request for downstream use
// Blocks access if token is missing, invalid, or user doesn't exist

import jwt from 'jsonwebtoken'
import User from '../Models/user.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        // Get the Authorization header from the request
        const authHeader = req.headers.authorization

        // If header is missing or doesn't start with 'Bearer ', block access
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "unauthorised"})
        }

        // Extract the token from the header (after 'Bearer ')
        const token = authHeader.split(" ")[1];
        // Verify the token using the secret key, decode user info
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        // Find the user in the database using the ID from the token
        const user = await User.findById(decoded.id);

        if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
        }

        // Attach user object to the request so later routes/controllers can use it
        req.user = user;
        // console.log(user);
        
        // Call next middleware or route handler
        next(); 
    } catch (err) {
        // Log error and block access if token is invalid or expired
        console.log({error: err});
        return res.status(401).json({ message: "Invalid token" });
    }
}

export default authMiddleware