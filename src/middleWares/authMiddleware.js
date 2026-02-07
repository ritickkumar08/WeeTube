import jwt from 'jsonwebtoken'
import User from '../Models/user.model';

const authMiddleware = async (req, res, next) => {
    try {
        // Retrieve the 'Authorization' header from the incoming HTTP request, which is expected to contain the JWT token
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "unauthorised"})
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findById(decoded.id);

        if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next(); 
    } catch (err) {
        console.log({error: err});
        return res.status(401).json({ message: "Invalid token" });
    }
}