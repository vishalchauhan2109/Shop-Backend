// const express = require("express");
import express from "express";
// const cors = require("cors");
import cors from "cors";
// const cookieParser = require("cookie-parser");
import cookieParser from "cookie-parser";
// const authRouter = require("./routes/authRoute")
import authRouter from "./routes/authRoute.js";
// const app = express();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  // credentials: true
}));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");  
  console.log("backend runs succesfully");  
});

app.use(authRouter)


// module.exports = app;
export default app;