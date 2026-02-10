# WeeTube
github Repository :- https://github.com/ritickkumar08/WeeTube

deployed on :- https://weetube.onrender.com


🎥 WeeTube – Backend API

Capstone Project: YouTube Clone

WeeTube is a backend REST API for a YouTube-like video sharing platform.
It handles authentication, video management, subscriptions, likes, comments, and views using Node.js, Express, MongoDB, and JWT-based authentication.

This project is designed following MVC architecture, focusing on scalability, security, and clean separation of concerns.

🧠 Tech Stack
Node.js – JavaScript runtime
Express.js – Web framework
MongoDB – NoSQL database
Mongoose – ODM for MongoDB
JWT (JSON Web Tokens) – Authentication & authorization
Cloudinary – Media storage (videos & thumbnails)
bcrypt – Password hashing
dotenv – Environment variable management

📂 Project Architecture
backend/
│
├── src/
│   ├── app.js                # Express app configuration
│   ├── server.js             # Server bootstrap & DB connection
│   │
│   ├── config/
│   │   └── db.js             # MongoDB connection logic
│   │
│   ├── models/               # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   └── comment.model.js
│   │
│   ├── controllers/          # Business logic
│   │   ├── auth.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   └── subscribe.controller.js
│   │
│   ├── routes/               # API routes
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   └── comment.routes.js
│   │
│   └── middlewares/          # Auth & ownership checks
│       ├── auth.middleware.js
│       └── owner.middleware.js
│
├── .env
├── package.json
└── README.md

🗄️ Database Design (Models)
👤 User Model
User {
  _id
  channelName
  email
  phone
  password
  logoUrl
  subscribers
  subscribedChannels
  likedVideos
  dislikedVideos
  watchLater
  watchHistory
  timestamps
}

🎬 Video Model
Video {
  _id
  userId
  title
  description
  videoUrl
  thumbnailUrl
  category
  tags
  views
  likes
  dislikes
  likedBy
  dislikedBy
  timestamps
}

💬 Comment Model
Comment {
  _id
  videoId
  userId
  commentText
  timestamps
}

🔐 Authentication & Authorization
Authentication is handled using JWT
Token is sent via Authorization: Bearer <token>
Passwords are hashed using bcrypt
Protected routes use an auth middleware
Ownership checks ensure only the owner can:

Edit/delete videos

Edit/delete comments

🚦 API Routes Overview
👤 User Routes
Method	Route	                      Description
POST	/user/signup	            Register a new user
POST	/user/login	                Login user & get JWT
PUT     /user/update	            Update user profile
PUT	    /user/subscribe/:id	        Subscribe to a channel
PUT	    /user/unsubscribe/:id	    Unsubscribe from a channel

🎥 Video Routes
Method	Route	                    Description
POST	/video/upload	            Upload a new video
PUT	    /video/update/:id	        Update video details
DELETE	/video/delete/:id	        Delete a video
GET	    /video/all	                Get all videos
GET	    /video/my	                Get logged-in user’s videos
GET	    /video/:id	                Get video by ID
GET	    /video/category/:category	Videos by category
GET	    /video/tags	                Videos by tags
PUT	    /video/views/:id	        Increment video views
PUT	    /video/like/:id	            Like a video
PUT	    /video/dislike/:id	        Dislike a video
💬 Comment Routes
Method	   Route	            Description
POST	/comment/:videoId	    Add a comment
GET	    /comment/:videoId	    Get all comments of a video
PUT	    /comment/edit/:id	    Edit a comment
DELETE	/comment/delete/:id	    Delete a comment

☁️ Cloudinary Integration
Cloudinary is used to:
Store uploaded videos
Store video thumbnails
Store user avatars
Uploads are handled via temporary files, then removed from the server after successful upload.

👁️ Views Logic

Views are not tied to authentication
Frontend controls when the view count is increased
Backend increments views using MongoDB atomic $inc

💬 Comment System

Only logged-in users can comment
Users can edit/delete only their own comments
Comments are populated with user data (channelName, logoUrl)

🧪 Environment Variables
PORT = 8080
MONGO_URI = mongodb_connection_string
SECRET_KEY = jwt_secret
CLOUDINARY_CLOUD_NAME = xxxx
CLOUDINARY_API_KEY = xxxx
CLOUDINARY_API_SECRET= xxxx

🚀 How to Run the Project
npm install
npm run dev

Server starts on:
http://localhost:8080

🎯 Key Learnings

REST API design
JWT-based authentication
MongoDB schema modeling
Ownership-based authorization
Cloudinary media handling
MVC architecture
Error handling & validation

