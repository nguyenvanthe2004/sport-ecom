const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    variants: {
      type: [{ type: Schema.Types.ObjectId, ref: "Variant" }],
      default: [],
    },
    name: { type: String, required: true },
    description: { type: String },
    slug: { type: String, unique: true, required: true },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
