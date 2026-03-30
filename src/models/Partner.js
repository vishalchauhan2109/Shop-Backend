// const express = require("express")
// const mongoose = require("mongoose")
import express from "express";
import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name must be less than 50 characters"],
        trim: true
    },

    shopname: {
        type: String,
        required: [true, "Shop name is required"],


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
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function (v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: "Phone number must be 10 digits"
        }
    },

    location: {
        type: String,
        required: [true, "Location is required"],
    },

    pincode: {
        type: Number,
        length: 6,
        required: [true, "Pincode is required"],
    }
    ,
    kyc:{
        type: boolean,
        default:false,
    }
}, { timestamps: true });


const Partner = mongoose.model('Partner', partnerSchema);
module.exports = Partner;