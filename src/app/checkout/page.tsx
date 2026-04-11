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
  ArrowRight,
  Loader2,
  ChevronDown,
  Home,
  Briefcase,
  CreditCard,
  Wallet,
  Banknote,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, totalPrice, discount } = useCart();
  const { isLoggedIn, isLoading, user } = useAuth();
  const router = useRouter();

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [notification, setNotification] = useState<{message: string, visible: boolean}>({
    message: "",
    visible: false
  });

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
      if (!isLoggedIn) {
        router.replace("/login");
      } 
      else if (cart.length === 0 && !isPlacingOrder) {
        router.replace("/cart");
      }
    }
  }, [isLoggedIn, cart.length, isLoading, router, isPlacingOrder]);

  const showToast = (msg: string) => {
    setNotification({ message: msg, visible: true });
    setTimeout(() => setNotification({ message: "", visible: false }), 4000);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode" && value.length === 6) {
      setIsPincodeLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();
        if (data[0].Status === "Success") {
          setFormData((prev) => ({ ...prev, state: data[0].PostOffice[0].State }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsPincodeLoading(false);
      }
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.address || !formData.pincode || !formData.state) {
      showToast("Please fill all mandatory fields.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const dbUserId = user?.id || user?._id;

      if (!dbUserId) {
        throw new Error("Session error. Please login again.");
      }

      // --- STEP 1: FINAL STOCK VALIDATION ---
      const stockCheck = await fetch("/api/orders/validate-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const stockData = await stockCheck.json();

      if (!stockCheck.ok) {
        throw new Error(stockData.error || "Some items are now out of stock.");
      }

      // --- STEP 2: PLACE ORDER ---
      const orderPayload = {
        userId: dbUserId, 
        items: cart.map(item => ({
          productId: item.id || (item as any).productId, 
          name: item.name,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        address: formData,
        total: finalTotal,
        paymentMethod: paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      sessionStorage.setItem("lastOrder", JSON.stringify(data.order));
      router.push("/order-success");

    } catch (err: any) {
      showToast(err.message);
      setIsPlacingOrder(false);
    }
  };

  if (isLoading || !isLoggedIn || (cart.length === 0 && !isPlacingOrder)) {
    return <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#7B2D0A]" size={30} /></div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 md:pb-20 pt-32 md:pt-40">
      
      {/* --- TOAST NOTIFICATION UI --- */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ y: 100, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 100, opacity: 0, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[300] w-[90%] md:w-auto"
          >
            <div className="bg-[#1C1C1C] text-[#D4AF37] px-8 py-4 rounded-2xl shadow-2xl border border-[#D4AF37]/20 flex items-center gap-4 backdrop-blur-md">
              <ShieldCheck size={18} className="text-green-500" />
              <p className="text-[11px] font-black uppercase tracking-[0.1em]">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPlacingOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#7B2D0A] mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">Finalizing Your Elegance...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="mb-10 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-stone-100 rounded-full cursor-pointer"><ChevronLeft size={20} /></button>
          <h1 className="text-2xl md:text-3xl font-serif text-stone-900 italic">Secure Checkout</h1>
        </div>

        <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-100">
              <SectionHeading icon={<MapPin size={18} />} title="Shipping Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <InputField label="Full Name *" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                <InputField label="Mobile Number *" name="phone" value={formData.phone} onChange={handleInputChange} required />
                <div className="md:col-span-2">
                  <InputField label="Email Address *" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="md:col-span-2">
                  <InputField label="House No. / Building Name *" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <InputField label="Street / Area / Locality *" name="area" value={formData.area} onChange={handleInputChange} required />
                <InputField label="Pincode *" name="pincode" value={formData.pincode} onChange={handleInputChange} maxLength={6} required />
                <InputField label={isPincodeLoading ? "Loading..." : "State *"} name="state" value={formData.state} readOnly required />
              </div>
              <div className="mt-12 flex gap-4">
                 <TypeBadge active={formData.addressType === "home"} onClick={() => setFormData({ ...formData, addressType: "home" })} icon={<Home size={14} />} label="Home" />
                 <TypeBadge active={formData.addressType === "work"} onClick={() => setFormData({ ...formData, addressType: "work" })} icon={<Briefcase size={14} />} label="Work" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-100">
              <SectionHeading icon={<CreditCard size={18} />} title="Payment Method" />
              <div className="space-y-4">
                <PaymentOption id="upi" label="UPI" icon={<Wallet size={18} />} active={paymentMethod === "upi"} onClick={setPaymentMethod} />
                <PaymentOption id="cod" label="Cash on Delivery" icon={<Banknote size={18} />} active={paymentMethod === "cod"} onClick={setPaymentMethod} />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-40">
            <div className="bg-[#1C1C1C] text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative">
              <button 
                type="button" 
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)} 
                className="w-full flex items-center justify-between mb-8 group border-b border-white/10 pb-4"
              >
                <p className="text-sm font-bold uppercase tracking-widest flex items-center gap-1">
                  Order Review 
                  <span>
                    <ChevronDown size={16} className={`transition-transform ${isSummaryExpanded ? "rotate-180" : ""}`} />
                  </span>
                </p>
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
                          <img 
                            src={item.image} 
                            className="w-12 h-16 object-cover rounded-lg bg-white/5 border border-white/10" 
                            alt={item.name} 
                          />
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
                <SummaryRow label="Subtotal" value={subtotal} />
                <SummaryRow label="Delivery" value={shipping === 0 ? "FREE" : shipping} />
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 block">Total</span>
                    <span className="text-4xl font-serif text-[#D4AF37]">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={isPlacingOrder} className="w-full mt-10 py-5 bg-[#D4AF37] text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl disabled:opacity-50">
                {isPlacingOrder ? <Loader2 className="animate-spin" /> : <>Place Order <ArrowRight size={16} /></>}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title }: any) { return <div className="flex items-center gap-3 mb-10 pb-5 border-b border-stone-100/50"><div className="p-2 bg-[#7B2D0A]/5 rounded-lg text-[#7B2D0A]">{icon}</div><h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">{title}</h2></div>; }
function InputField({ label, ...props }: any) { return <div className="relative group"><input {...props} className="peer w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-[#7B2D0A] transition-all text-sm font-medium placeholder-transparent" placeholder={label} /><label className="absolute left-0 -top-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[#7B2D0A] pointer-events-none uppercase">{label}</label></div>; }
function PaymentOption({ id, label, icon, active, onClick }: any) { return <button type="button" onClick={() => onClick(id)} className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${active ? "border-[#7B2D0A] bg-[#7B2D0A]/5" : "border-stone-100"}`}><div className="flex items-center gap-4"><div className={`p-2.5 rounded-xl ${active ? "bg-[#7B2D0A] text-white" : "bg-stone-100 text-stone-400"}`}>{icon}</div><p className={`text-[12px] font-bold uppercase tracking-tight ${active ? "text-stone-900" : "text-stone-500"}`}>{label}</p></div></button>; }
function SummaryRow({ label, value }: any) { return <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-500"><span>{label}</span><span className="font-poppins tracking-tight">{typeof value === "number" ? `₹${value.toLocaleString()}` : value}</span></div>; }
function TypeBadge({ active, onClick, icon, label }: any) { return <button type="button" onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${active ? "bg-[#D4AF37] text-black" : "border-white/20 text-stone-400"}`}> {icon} {label} </button>; }