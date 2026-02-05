import express from 'express'

const app = express()
app.use(express.json()) //a built-in middleware to convert the responses to json format to understand.



/* -------------------- Global Error Handler -------------------- */
//This middleware handles errors. that are not because of the users but something broke internally
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
})

export default app