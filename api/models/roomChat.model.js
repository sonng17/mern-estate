import mongoose from "mongoose";
const roomChatSchema = new mongoose.Schema(
  {
    users: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const RoomChat = mongoose.model("RoomChat", roomChatSchema);
export default RoomChat;
