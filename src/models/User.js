import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
      trim: true,
    },

    emailid: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
     
    },

    phonenumber: {
      type: String,
      default: "",
      unique: true,
      sparse: true,
      trim: true,
    },

    pincode: {
      type: Number,
      min: [100000, "Pincode must be 6 digits"],
      max: [999999, "Pincode must be 6 digits"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;