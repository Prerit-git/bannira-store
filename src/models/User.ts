import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  image: { type: String },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
    size: { type: String },
  }
],
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model("User", UserSchema);
export default User;