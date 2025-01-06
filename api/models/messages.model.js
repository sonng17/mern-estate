import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    roomChatRef: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    message: {
      type: {
        from: String,
        content: String,
        read: Boolean,
      },
      required: true,
    },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;
