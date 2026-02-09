import bcrypt from 'bcrypt'
import fs from 'fs'
import User from '../Models/user.model.js'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
    cloud_name : 'ds30udzxa', 
    api_key : '243467972227774', 
    api_secret : 'DX0_uVr0JZvtoJtFXessz3LhzZE' // Click 'View API Keys' above to copy your API secret
});

const signupController = async (req, res) => {
    try {
        //getting the data from the request body to process further
        const {userName, channelName, email, password, phone} = req.body

        //validateing the fields that are needed
        if(!userName || !channelName || !email || !password){
            return res.status(400).json({message : 'all fileds are required!'})
        }

        //checking for the picture if it is present.
        if (!req.files || !req.files.logo) {
            return res.status(400).json({ message: "logo image is required" });
        }
        
        //so that same emails with just a chnage in uppercase and lowercase don't arrive to database, or may be chaos
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedChannelName = channelName.trim();
        const normalizedUserName = userName.trim()

        //validating the email structure
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        //if the given email doesn't follow the structure 
        if (!validEmail.test(normalizedEmail)) {
            return res.status(400).json({message: "Email format is not valid"});
        }

        // Regular expression enforcing strong password rules:
        // - at least 8 characters
        // - at least one lowercase letter
        // - at least one uppercase letter
        // - at least one number
        // - at least one special character
        const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

        // Reject weak passwords to reduce brute-force and credential stuffing risks
        if(!validPassword.test(password.trim())){
            return res.status(400).json(
                {message: 'choose a strong passwor the password must have 8 characters, one upper and lower case letter, a number, and atleast one special character'}
            )
        }

        //check if the user already exists then they can't register.
        const existingUser = await User.findOne({ email: normalizedEmail })

        //if user exists return immediately.
        if(existingUser){
            return res.status(400).json({message: 'user already exists'})
        }

        // Check if channelName exists (if unique in schema)
        const existingChannel = await User.findOne({ channelName: normalizedChannelName });
        if (existingChannel) {
        return res.status(400).json({ message: 'Channel name is already taken' });
        }

        //hashing the password using bcrypt
        // 10 salt rounds is a reasonable balance between security and performance
        const hashedPassword = await bcrypt.hash(password, 10)

        //uploading the picture
        const uploadedImage = await cloudinary.uploader.upload(req.files.logo.tempFilePath, { folder: "weetube/logo" })
        // console.log(uploadedImage);
        
        fs.unlinkSync(req.files.logo.tempFilePath);

        //create a new user documnet in our database
        await User.create({
            logoUrl: uploadedImage.secure_url,
            logoId: uploadedImage.public_id,
            channelName: normalizedChannelName,
            userName: normalizedUserName,
            email: normalizedEmail,
            phone: phone,
            password: hashedPassword,
        });

        // Send success response after successful registration
        // No sensitive data is returned
        res.status(201).json({ message: "User registered successfully. Please login to continue.",});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err})
    }
}

export default signupController