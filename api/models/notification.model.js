import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["approval", "rejection", "general"], // Chỉ định các loại hợp lệ
      default: "general",
    },
    listingRef: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    adminMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
