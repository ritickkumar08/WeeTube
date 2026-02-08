// Configure Express.
// middleware (json, cors)
// route mounting
// global error handler
import express from 'express'
import fileUpload from "express-fileupload";

import userRoutes from './Routes/user.routes.js'
import videoRouter from './Routes/video.route.js'

const app = express()
app.use(express.json()) //a built-in middleware to convert the responses to json format to understand.
// file upload middleware
app.use(fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use('/user',userRoutes)
app.use('/video',videoRouter)


/* -------------------- Global Error Handler -------------------- */
//This middleware handles errors. that are not because of the users but something broke internally
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
})

export default app