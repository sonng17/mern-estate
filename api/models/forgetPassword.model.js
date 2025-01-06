import mongoose from "mongoose";

//Create schema for model
const forgetPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    resetCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); //

//Create model using its created schema
const ForgetPassword = mongoose.model("ForgetPassword", forgetPasswordSchema);

export default ForgetPassword;
