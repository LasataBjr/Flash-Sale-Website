📁 Server – Backend (MERN)

This folder contains the backend API for the Flash Sale Website, built using Node.js, Express, and MongoDB.

🛠 Tech Stack

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Cloudinary (Image Uploads)

Nodemailer (Email)

Multer (File Handling)

📦 Installed Packages

The backend uses the following npm packages:

bcryptjs → Password hashing
cloudinary → Image storage
cookie-parser → Read cookies
cors → Cross-origin requests
dotenv → Environment variables
express → Server framework
helmet → Security headers
jsonwebtoken → Authentication (JWT)
mongoose → MongoDB ODM
morgan → HTTP request logging
multer → File uploads
nodemailer → Email sending
nodemon → Auto-restart during development

📂 Folder Structure
Server/
│
├── middleware/ # Auth, error handlers, etc.
├── models/ # Mongoose schemas
├── routes/ # API routes
├── .env # Environment variables (NOT committed)
├── package.json
├── package-lock.json
├── server.js # Entry point
└── README.md

⚠️ Important Rules (Read Before Starting)
❌ Do NOT commit:

node_modules/
.env

These are already included in .gitignore.

🚀 Getting Started
1️⃣ Navigate to Server folder
cd Server

2️⃣ Install dependencies
npm install

<!--
3️⃣ Create .env file

Create a file named .env inside the Server folder:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

-->

4️⃣ Run the server
Development mode (recommended)
npm run dev

Production mode
npm start

Server will run at:

http://localhost:5000

#Optional:

📜 Available Scripts
"main": "server.js",
"scripts": {
"start": "node server.js",
"dev": "nodemon server.js"
}

<!--
🧪 API Testing

Use:

Postman

Thunder Client

Insomnia

-->

📌 Troubleshooting
MongoDB connection error

✔ Check MONGO_URI
✔ Ensure IP is whitelisted in MongoDB Atlas

Server not starting

✔ Check Node version
✔ Run npm install again
✔ Ensure .env exists
