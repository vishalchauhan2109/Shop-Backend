import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";


export const register = async (req, res) => {
  try {
    let { name, email, password, phonenumber, pincode } = req.body;

    // ==========================================
    // 1. Check required fields
    // ==========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // ==========================================
    // 2. Sanitize basic input
    // ==========================================

    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (phonenumber) {
      phonenumber = String(phonenumber).trim();
    }

    if (pincode) {
      pincode = Number(pincode);
    }

    // ==========================================
    // 3. Name validation
    // ==========================================

    if (name.length < 3) {
      return res.status(400).json({
        message: "Name must be at least 3 characters",
      });
    }

    if (name.length > 50) {
      return res.status(400).json({
        message: "Name must be less than 50 characters",
      });
    }

    // Allow letters, spaces, dots, apostrophes and hyphens
    const nameRegex = /^[A-Za-z\s.'-]+$/;

    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message: "Name can contain only letters and spaces",
      });
    }

    // ==========================================
    // 4. Email validation
    // ==========================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email",
      });
    }

    // ==========================================
    // 5. Password validation
    // ==========================================

    if (password.length < 6 || password.length > 15) {
      return res.status(400).json({
        message: "Password must be between 6 and 15 characters",
      });
    }

    // Optional: stronger password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number and special character",
      });
    }

    // ==========================================
    // 6. Phone number validation
    // ==========================================

    if (phonenumber) {
      const phoneRegex = /^[6-9]\d{9}$/;

      if (!phoneRegex.test(phonenumber)) {
        return res.status(400).json({
          message: "Please enter a valid 10-digit phone number",
        });
      }
    }

    // ==========================================
    // 7. Pincode validation
    // ==========================================

    if (pincode !== undefined && pincode !== null && pincode !== "") {
      if (!Number.isInteger(pincode)) {
        return res.status(400).json({
          message: "Pincode must contain only numbers",
        });
      }

      if (pincode < 100000 || pincode > 999999) {
        return res.status(400).json({
          message: "Pincode must be exactly 6 digits",
        });
      }
    }

    console.log("Validation successful");

    // ==========================================
    // 8. Check existing email
    // ==========================================

    const existingEmail = await User.findOne({
      emailid: email,
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // ==========================================
    // 9. Check existing phone number
    // ==========================================

    if (phonenumber) {
      const existingPhone = await User.findOne({
        phonenumber,
      });

      if (existingPhone) {
        return res.status(409).json({
          message: "User with this phone number already exists",
        });
      }
    }

    // ==========================================
    // 10. Hash password
    // ==========================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================================
    // 11. Create user
    // ==========================================

    const user = await User.create({
      name,
      emailid: email,
      password: hashedPassword,
      phonenumber: phonenumber || "",
      pincode: pincode || undefined,
    });

    // ==========================================
    // 12. Generate JWT
    // ==========================================

    // const token = generateToken(user._id);

    // ==========================================
    // 13. Store token in HTTP-only cookie
    // ==========================================

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // });

    // ==========================================
    // 14. Response
    // ==========================================

    return res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        emailid: user.emailid,
        phonenumber: user.phonenumber,
        pincode: user.pincode,
      },
    });

    console.log("User registered successfully:", user);
  } catch (error) {
    console.error("Register Error:", error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];

      return res.status(409).json({
        message: `${duplicateField} already exists`,
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


export const login = async (req, res) => {

  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ message: "Please Fill ALL The Fields" })
    }

    const checkUser = await User.findOne({ emailid: email })


    if (!checkUser) {
      return res.status(400).json({ message: "User Not Found" })
    }

    const isPasswordValid = await bcrypt.compare(password, checkUser.password)

    if (!isPasswordValid) {
      return res.status(400).json({ message: "wrong credentials" })
    }

    const token = generateToken(checkUser._id);

    console.log("TOKEN GENERATED:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: checkUser._id,
        name: checkUser.name,
        emailid: checkUser.emailid,
        phonenumber: checkUser.phonenumber,
        pincode: checkUser.pincode,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        emailid: user.emailid,
        phonenumber: user.phonenumber,
        pincode: user.pincode,
      },
    });

  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      message: "Failed to get user",
    });
  }
};