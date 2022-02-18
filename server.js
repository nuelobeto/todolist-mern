// require all the necessary packages...
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Declare variables...
const app = express();
const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;

// Import routes
const authRoutes = require("./routes/authRoutes");

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

// Format to json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the routes
app.use("/api/auth", authRoutes);

// Call the function to connect to mongoDB
connectDB();

// Start the server on the predefined port
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
