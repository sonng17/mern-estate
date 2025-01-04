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
        "https://cdn.tuoitre.vn/thumb_w/480/471584752817336320/2024/11/24/chill-guy-ttc-1732421724981667208220.jpg",
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
  },
  { timestamps: true }
); //

//Create model using its created schema
const User = mongoose.model("User", userSchema);

export default User;
