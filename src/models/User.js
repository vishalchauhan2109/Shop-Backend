const express = require ("express")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [50, "Name must be less than 50 characters"],
    trim: true
  },

  emailid: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email format"
    }
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },

  phonenumber: {
    type: String, // ❗ change Number → String
    required: [true, "Phone number is required"],
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: "Phone number must be 10 digits"
    }
  }
});


const User = mongoose.model('User', userSchema);
module.exports = User;