import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    console.log("========== AUTH DEBUG ==========");

    console.log("Cookie Header:", req.headers.cookie);
    console.log("Parsed Cookies:", req.cookies);

    const token = req.cookies?.token;

    console.log("TOKEN:", token);
    console.log("TOKEN TYPE:", typeof token);
    console.log("TOKEN DOT COUNT:", token?.split(".").length - 1);

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED TOKEN:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error("Auth error:", error);
    console.error("Auth error message:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};