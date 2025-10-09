const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VariantSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  nameDetail: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
  createAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Variant", VariantSchema);
