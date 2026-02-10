import bcrypt from 'bcrypt'
import User from '../Models/user.model.js'

const signupController = async (req, res) => {
    try {
        //getting the data from the request body to process further
        const {userName, email, password} = req.body

        //validateing the fields that are needed
        if(!userName || !email || !password){
            return res.status(400).json({message : 'all fileds are required!'})
        }
        
        //so that same emails with just a chnage in uppercase and lowercase don't arrive to database, or may be chaos
        const normalizedEmail = email.toLowerCase().trim();
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

        //hashing the password using bcrypt
        // 10 salt rounds is a reasonable balance between security and performance
        const hashedPassword = await bcrypt.hash(password, 10)

        //create a new user documnet in our database
        await User.create({
            userName: normalizedUserName,
            email: normalizedEmail,
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