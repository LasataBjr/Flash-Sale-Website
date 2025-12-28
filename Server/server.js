// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const app = express();

app.use(cors());// Allow requests from your frontend
app.use(express.json());

// Serve static files from the 'uploads' directory (absolute path for reliability)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Optional: Log the path for debugging (remove after fixing)
console.log('Static path:', path.join(__dirname, 'uploads'));

// Routes
//Users
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

//Business
const businessRoutes = require("./routes/businessRoutes");
app.use("/api/business", businessRoutes);

//Admin
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

//Auth
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

//Product
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// Category
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

// Multer / Global Error Handler
app.use((err, req, res, next) => {
  console.error("UPLOAD ERROR:", err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("Server + MongoDB running!");
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
