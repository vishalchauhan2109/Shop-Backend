import express from "express";
import { getMe, login, logout, register } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";



const authouter = express.Router();
authouter.post("/register", register)


authouter.post("/login",login)

authouter.get("/me", protect, getMe);

authouter.post("/logout", logout);

export default authouter