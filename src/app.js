const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoute")

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true
}));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");  
  console.log("backend runs succesfully");  
});

app.use(authRouter)


module.exports = app;