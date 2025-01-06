import mongoose from "mongoose";
const districtSchema = new mongoose.Schema(
  {
    districtName: {
      type: String,
      required: true,
    },
    districtSlug: {
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
const District = mongoose.model("District", districtSchema);
export default District;
