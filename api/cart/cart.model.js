import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "products",
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  orderedQuantity: { type: Number, required: true, min: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
