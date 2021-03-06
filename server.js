// require all the necessary packages...
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

// Declare variables...
const app = express();
const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

// Connect app to mongoDB using mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri);
    console.log("connected to mongoDB database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// Call the function to connect to mongoDB
connectDB();

// Start the server on the predefined port
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
