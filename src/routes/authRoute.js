// const express = require("express");

import express from "express";
import { login, register } from "../controllers/authController.js";

const authouter = express.Router();
authouter.post("/register", register)


authouter.post("/login",login)

export default authouter