import express from "express";
import { getMe, login, register } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";


const authouter = express.Router();
authouter.post("/register", register)


authouter.post("/login",login)

authouter.get("/me", protect, getMe);

export default authouter