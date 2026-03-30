import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";


export const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please Fill ALL The Fields" })
        }
        const isValidEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };
        console.log("1")
        if (!isValidEmail) {
            return res.status(400).json({ message: "Please Enter Valid Email" })
        }

        if (password.length < 6 || password.length > 15) {
            return res.status(400).json({ message: "Please Enter Valid Password" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // 10 = salt rounds (security level)

        console.log("2")
        const checkUser = await User.findOne({ emailid: email })
        if (checkUser) {
            return res.status(400).json({ message: "User Already Exists" })
        }
        console.log("3")


        const user = await User.create({
            name,
            emailid: email,
            password: hashedPassword
        })

        res.cookie("token", generateToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        }); 
        res.status(201).json({ message: "User Registered Successfully", user })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

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
        res.cookie("token", generateToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ Message: "Login successful", user: checkUser });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" })
    }
}