import mongoose from "mongoose";
const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
    },
    citySlug: {
      type: String,
      required: true,
    },
    cityRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const City = mongoose.model("City", citySchema);
export default City;
