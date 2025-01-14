import mongoose from "mongoose";

//Create schema for model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://greekherald.com.au/wp-content/uploads/2020/07/default-avatar.png",
    },
    bio: {
      type: String,
      default: "Chưa có bio",
    },
    phone: {
      type: String,
      unique: true,
      default: "Hiện chưa có SĐT",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "deactive"],
      default: "active",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); //

//Create model using its created schema
const User = mongoose.model("User", userSchema);

export default User;
