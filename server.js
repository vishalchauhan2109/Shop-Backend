// const app = require("./src/app");
import app from "./src/app.js";
// const connectDB = require("./src/config/db");
import connectDB from "./src/config/db.js";

// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // wait for DB connection

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();