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

// CORS: set on every response so they're never missing (Render, errors, etc.)
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,X-Requested-With')
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  next()
})

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204,
}))

app.use(express.json()) //a built-in middleware to convert the responses to json format to understand.

app.use('/user', userRoutes)
app.use('/video', videoRouter)
app.use('/comment', commentRouter)
app.use('/channel', channelRouter)
app.use('/others', otherRouter)

app.get('/', (req, res) => {
  res.send('a happy start')
})

// So you can confirm deployed app has latest CORS: open in browser and check Response Headers for Access-Control-Allow-Origin
app.get('/health', (req, res) => {
  res.json({ ok: true, cors: true })
})

/* -------------------- Global Error Handler -------------------- */
//This middleware handles errors. that are not because of the users but something broke internally
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
})

export default app