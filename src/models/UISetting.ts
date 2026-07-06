import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroBanner {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaLink?: string;
}

export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  isNewUserOnly: boolean;
}

export interface IUISetting extends Document {
  topStripText: string[];
  discountCode: string;
  discountValue: number;
  heroBanners: IHeroBanner[];
  featuredProductIds: mongoose.Types.ObjectId[];
  shippingCost: number;
  gstPercentage: number;
  coupons: ICoupon[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroBannerSchema = new Schema<IHeroBanner>({
  imageUrl: { type: String, required: true },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  ctaLink: { type: String, default: "" }
});

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, default: undefined },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const UISettingSchema = new Schema<IUISetting>({
  topStripText: { 
    type: [String], 
    default: [
      "FREE SHIPPING ON ALL ORDERS ABOVE ₹4999",
      "FLAT 10% OFF ON YOUR FIRST PURCHASE | USE CODE: BANNIRA10",
      "NEW FESTIVE KURTI COLLECTION IS NOW LIVE",
      "CASH ON DELIVERY AVAILABLE PAN INDIA"
    ] 
  },
  discountCode: { type: String, default: "BANNIRA10" },
  discountValue: { type: Number, default: 10 },
  heroBanners: [HeroBannerSchema],
  featuredProductIds: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  shippingCost: { type: Number, default: 150 },
  gstPercentage: { type: Number, default: 18 },
  coupons: [CouponSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.UISetting || mongoose.model<IUISetting>('UISetting', UISettingSchema);