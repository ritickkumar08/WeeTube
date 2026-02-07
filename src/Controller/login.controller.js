import User from "../Models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const loginController = async (req, res) => {
    try {
        //extracting email and password from the body.
        const { email, password } = req.body;

        //checking if the required details are sent
        if(!email || !password){
            return res.status(400).json({message : 'email and password required'})
        }

        //so that same emails with just a chnage in uppercase and lowercase don't arrive to database, or may be chaos
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedPassword = password.trim();

        //finding the user and explicity sending the password
        const user = await User.findOne({ email: normalizedEmail }).select('+password')

        //we do NOT reveal which field was wrong
        if(!user){
            return res.status(401).json({message : 'invalid credentials'})
        }

        // Compare the provided password with the stored hashed password using bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password)

        if(!isValidPassword){
            return res.status(401).json({message : 'invalid credentials'})
        }
        //we clear the password immediately.
        user.password = undefined;

        //now creating the token including 
        const token = jwt.sign(
            {
                id: user._id,
                hasChannel: !!user.channel
            },
            process.env.SECRET_KEY,
            {expiresIn : '1d'}
        )

        //sending a response after everything is processed.
        res.status(200).json({
            message: 'succesfully logged In',
            token,
            user:{
                user: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                avatarId: user.avatarId,
                hasChannel: !!user.channel,
            }
        })

    } catch (err) {
        //a over all catch for all and any errors we get during try block.
        console.log(err);
        res.status(500).json({error: err})
    }
}

export default loginController