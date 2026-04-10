"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ShieldCheck,
  MapPin,
  Truck,
  ArrowRight,
  Loader2,
  ChevronDown,
  Home,
  Briefcase,
  CreditCard,
  Wallet,
  Banknote,
  Mail,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, totalPrice, discount } = useCart();
  const { isLoggedIn, isLoading, user } = useAuth();
  const router = useRouter();

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  const subtotal = totalPrice;
  const shipping = subtotal > 5000 ? 0 : 250;
  const tax = Math.round(subtotal * 0.12);
  const finalTotal = subtotal + shipping + tax - discount;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    landmark: "",
    state: "",
    pincode: "",
    addressType: "home",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || (user as any).phoneNumber || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) router.replace("/login");
      else if (cart.length === 0) router.replace("/cart");
    }
  }, [isLoggedIn, cart.length, isLoading, router]);

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode" && value.length === 6) {
      setIsPincodeLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev) => ({ ...prev, state: postOffice.State }));
        } else {
          setFormData((prev) => ({ ...prev, state: "" }));
        }
      } catch (error) {
        console.error("Pincode API Error:", error);
      } finally {
        setIsPincodeLoading(false);
      }
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.address || !formData.pincode || !formData.state) {
      alert("Please fill all mandatory fields to proceed.");
      return;
    }

    const newOrder = {
      orderId: `BAN${Math.floor(100000 + Math.random() * 900000)}`,
      items: cart,
      total: finalTotal,
      paymentMethod,
      address: formData,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    const existingOrdersString = localStorage.getItem("bannira_orders");
    const existingOrders = existingOrdersString ? JSON.parse(existingOrdersString) : [];
    localStorage.setItem("bannira_orders", JSON.stringify([newOrder, ...existingOrders]));
    sessionStorage.setItem("lastOrder", JSON.stringify(newOrder));
    router.push("/order-success");
  };

  if (isLoading || !isLoggedIn || cart.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#7B2D0A]" size={30} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 md:pb-20 pt-32 md:pt-40">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-stone-100 rounded-full transition-colors cursor-pointer">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl md:text-3xl font-serif text-stone-900 tracking-tight italic">Secure Checkout</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-stone-400">
            <ShieldCheck size={14} className="text-green-600" /> Secure Checkout
          </div>
        </div>

        <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-100">
              <SectionHeading icon={<MapPin size={18} />} title="Shipping Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <InputField label="Full Name *" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                <InputField label="Mobile Number *" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                <div className="md:col-span-2">
                  <InputField label="Email Address *" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  <p className="text-[9px] text-[#7B2D0A] font-bold uppercase mt-2 flex items-center gap-1.5 tracking-tighter">
                    <Mail size={10} /> Order details & tracking will be sent here
                  </p>
                </div>
                <div className="md:col-span-2">
                  <InputField label="House No. / Building Name *" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <InputField label="Street / Area / Locality *" name="area" value={formData.area} onChange={handleInputChange} required />
                <InputField label="Landmark (Optional)" name="landmark" value={formData.landmark} onChange={handleInputChange} />
                <InputField label="Pincode *" name="pincode" value={formData.pincode} onChange={handleInputChange} maxLength={6} required />
                <InputField label={isPincodeLoading ? "Fetching State..." : "State *"} name="state" value={formData.state} onChange={handleInputChange} readOnly={!isPincodeLoading && formData.state !== ""} className={formData.state ? "bg-stone-50 font-bold" : ""} required />
              </div>
              <div className="mt-12">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-5">Save Address As</p>
                <div className="flex gap-4">
                  <TypeBadge active={formData.addressType === "home"} onClick={() => setFormData({ ...formData, addressType: "home" })} icon={<Home size={14} />} label="Home" />
                  <TypeBadge active={formData.addressType === "work"} onClick={() => setFormData({ ...formData, addressType: "work" })} icon={<Briefcase size={14} />} label="Work" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-100">
              <SectionHeading icon={<CreditCard size={18} />} title="Payment Method" />
              <div className="space-y-4">
                <PaymentOption id="upi" label="UPI (GPay, PhonePe, Paytm)" icon={<Wallet size={18} />} active={paymentMethod === "upi"} onClick={setPaymentMethod} />
                <PaymentOption id="card" label="Debit / Credit Card" icon={<CreditCard size={18} />} active={paymentMethod === "card"} onClick={setPaymentMethod} />
                <PaymentOption id="cod" label="Cash on Delivery (COD)" icon={<Banknote size={18} />} active={paymentMethod === "cod"} onClick={setPaymentMethod} subtext="Pay on delivery via Cash or QR" />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-40">
            <div className="bg-[#1C1C1C] text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-3xl -mr-16 -mt-16" />
              <button type="button" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)} className="w-full flex items-center justify-between mb-8 group border-b border-white/10 pb-4">
                <p className="text-sm font-bold uppercase tracking-widest flex items-center gap-1">Order Review <span><ChevronDown size={16} className={`transition-transform ${isSummaryExpanded ? "rotate-180" : ""}`} /></span></p>
                <div className="flex items-center gap-2 text-stone-400 group-hover:text-white transition-colors">
                  <span className="text-[10px] font-bold uppercase">{cart.length} Items</span>
                </div>
              </button>
              <AnimatePresence>
                {isSummaryExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-6 mb-8 max-h-[220px] overflow-y-auto no-scrollbar border-b border-white/10 pb-8">
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center">
                          <img src={item.image} className="w-12 h-16 object-cover rounded-lg bg-white/5 border border-white/10" alt={item.name} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold uppercase truncate tracking-tight">{item.name}</p>
                            <p className="text-[9px] text-stone-500 mt-1 uppercase font-bold">Size {item.size} · Qty {item.quantity}</p>
                          </div>
                          <p className="text-xs font-bold font-poppins text-[#D4AF37]">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-4 pt-2">
                <SummaryRow label="Bag Subtotal" value={subtotal} />
                {discount > 0 && <SummaryRow label={`Coupon Discount`} value={-discount} isDiscount />}
                <SummaryRow label="Delivery Charges" value={shipping === 0 ? "FREE" : shipping} />
                <SummaryRow label="Total Tax" value={tax} />
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 block">Total Amount</span>
                    <span className="text-4xl font-serif text-[#D4AF37]">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button type="submit" className="hidden md:flex w-full mt-10 py-5 bg-[#D4AF37] text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] items-center justify-center gap-2 hover:bg-white transition-all shadow-xl">
                Place Order <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white border-t border-stone-100 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-5">
          <div className="flex-1">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Payable Total</p>
            <p className="text-xl font-bold text-black font-poppins">₹{finalTotal.toLocaleString()}</p>
          </div>
          <button form="checkout-form" type="submit" className="flex-[1.5] bg-black text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg">
            Place Order <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title }: any) {
  return (
    <div className="flex items-center gap-3 mb-10 pb-5 border-b border-stone-100/50">
      <div className="p-2 bg-[#7B2D0A]/5 rounded-lg text-[#7B2D0A]">{icon}</div>
      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">{title}</h2>
    </div>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <div className="relative group">
      <input {...props} className={`peer w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-[#7B2D0A] transition-all text-sm font-medium placeholder-transparent ${props.className || ""}`} placeholder={label} />
      <label className="absolute left-0 -top-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:font-normal peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#7B2D0A] pointer-events-none uppercase">
        {label}
      </label>
    </div>
  );
}

function TypeBadge({ active, onClick, icon, label }: any) {
  return (
    <button type="button" onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${active ? "bg-[#1C1C1C] border-[#1C1C1C] text-white shadow-xl" : "border-stone-200 text-stone-400 hover:border-stone-400"}`}>
      {icon} {label}
    </button>
  );
}

function PaymentOption({ id, label, icon, active, onClick, subtext }: any) {
  return (
    <button type="button" onClick={() => onClick(id)} className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${active ? "border-[#7B2D0A] bg-[#7B2D0A]/5" : "border-stone-100 hover:border-stone-200"}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${active ? "bg-[#7B2D0A] text-white" : "bg-stone-100 text-stone-400"}`}>{icon}</div>
        <div className="text-left">
          <p className={`text-[12px] font-bold uppercase tracking-tight ${active ? "text-stone-900" : "text-stone-500"}`}>{label}</p>
          {subtext && <p className="text-[9px] text-stone-400 italic font-medium mt-0.5">{subtext}</p>}
        </div>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-[#7B2D0A]" : "border-stone-200"}`}>
        {active && <div className="w-2.5 h-2.5 bg-[#7B2D0A] rounded-full" />}
      </div>
    </button>
  );
}

function SummaryRow({ label, value, isDiscount }: any) {
  return (
    <div className={`flex justify-between text-[11px] font-bold uppercase tracking-widest ${isDiscount ? "text-green-400" : "text-stone-500"}`}>
      <span>{label}</span>
      <span className="font-poppins tracking-tight">{typeof value === "number" ? `₹${value.toLocaleString()}` : value}</span>
    </div>
  );
}