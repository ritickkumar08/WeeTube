//Start the application.
//it contains the database connection logic.
import dotenv from 'dotenv'
import app from './src/app.js';

dotenv.config(); //to configure the data in .env file to whole of the server or app.

const PORT = 8080

app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`); //a response so that we know that the server is listening to the port
})