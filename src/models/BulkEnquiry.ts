import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IBulkEnquiry extends Document {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  gstNumber?: string;
  // Selected products ka strict multi-item array summary
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
  }[];
  message?: string;
  status: "New" | "Contacted" | "Closed";
  createdAt: Date;
}

const BulkEnquirySchema = new Schema<IBulkEnquiry>(
  {
    name: { type: String, required: true },
    companyName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gstNumber: { type: String },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true }, // MRP ya Retail Price baseline mapping ke liye
      },
    ],
    message: { type: String },
    status: {
      type: String,
      default: "New",
      enum: ["New", "Contacted", "Closed"],
    },
  },
  { timestamps: true }
);

const BulkEnquiry = models.BulkEnquiry || model<IBulkEnquiry>("BulkEnquiry", BulkEnquirySchema);
export default BulkEnquiry;