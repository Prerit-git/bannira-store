import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    area: string;
    landmark?: string;
    pincode: string;
    state: string;
    addressType: string;
  };
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      area: { type: String, required: true },
      landmark: { type: String },
      pincode: { type: String, required: true },
      state: { type: String, required: true },
      addressType: { type: String, default: "home" },
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: { 
      type: String, 
      required: true, 
      enum: ["upi", "card", "cod"] 
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "Failed"],
    },
    orderStatus: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);
export default Order;