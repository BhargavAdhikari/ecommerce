import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, maxlength: 55, required: true, trim: true },
  brand: { type: String, maxlength: 55, required: true, trim: true },
  price: { type: Number, min: 1, required: true },
  quantity: { type: Number, min: 1, required: true },
  description: { type: String, maxlength: 1000, required: true, trim: true },
  category: {
    type: String,
    trim: true,
    required: true,
    enum: [
      "electronics",
      "clothing",
      "shoes",
      "grocery",
      "auto",
      "sports",
      "furniture",
      "liquor",
    ],
  },
  freeshipping: { type: Boolean, required: true },
  sellerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  image: { type: String, required: true, trim: true },
});
productSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.sellerID;
  return obj;
};
export const Product = mongoose.model("Product", productSchema);
