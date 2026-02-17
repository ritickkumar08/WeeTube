// Configure Express.
// middleware (json, cors)
// route mounting
// global error handler
import express from 'express'
import userRoutes from './Routes/user.routes.js'
import videoRouter from './Routes/video.route.js'
import commentRouter from './Routes/comment.route.js'
import channelRouter from './Routes/channel.route.js';
import otherRouter from './Routes/other.route.js'
import cors from "cors";
import dotenv from 'dotenv'


dotenv.config() //to configure the data in .env file to whole of the server or app.
const app = express()

//use cors middleware
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));
app.use(express.json()) //a built-in middleware to convert the responses to json format to understand.

app.use('/user', userRoutes)
app.use('/video', videoRouter)
app.use('/comment', commentRouter)
app.use('/channel', channelRouter)
app.use('/others', otherRouter)

app.get('/',(req,res)=>{
  res.send('a happy start')
})

/* -------------------- Global Error Handler -------------------- */
//This middleware handles errors. that are not because of the users but something broke internally
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
})

export default app