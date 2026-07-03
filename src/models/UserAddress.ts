import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUserAddress extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  landmark?: string;
  state: string;
  pincode: string;
  addressType: "home" | "work";
  gstNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserAddressSchema = new Schema<IUserAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required mapping checkpoint"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, "Shipping address line is required"],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "Area / Locality is required"],
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      required: [true, "State region selection is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
    },
    addressType: {
      type: String,
      enum: ["home", "work"],
      default: "home",
      lowercase: true,
    },
    gstNumber: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserAddress = models.UserAddress || model<IUserAddress>("UserAddress", UserAddressSchema);

export default UserAddress;