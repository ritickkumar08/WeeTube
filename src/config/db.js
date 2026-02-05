import mongoose from "mongoose";

const dbConnect = async () => {
    try{
        // Ensure the connection string is present before attempting to connect
        if(!process.env.MONGO_URI){
            throw new Error('please define the Mongo URI in the .env file')
        }

        //we will try to connect the mongodb cluster
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connection to database done : ${conn.connection.host}`);
    }catch(err){
        // Log the specific error and exit the process with a failure code
        console.error(`MongoDB connection failed: ${err.message}`);
        process.exit(1);
    }
}

export default dbConnect