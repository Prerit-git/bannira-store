"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ShieldCheck, MapPin, ArrowRight, Loader2,
  ChevronDown, Home, Briefcase, CreditCard, Wallet, Banknote,
  Plus, History, CheckCircle2
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, totalPrice, discount } = useCart();
  const { isLoggedIn, isLoading, user } = useAuth();
  const router = useRouter();

  // States
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [usePreviousAddress, setUsePreviousAddress] = useState(false);
  const [lastAddress, setLastAddress] = useState<any>(null);
  const [notification, setNotification] = useState({ message: "", visible: false });

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

  const subtotal = totalPrice;
  const shipping = subtotal > 5000 ? 0 : 250;
  const tax = Math.round(subtotal * 0.12);
  const finalTotal = subtotal + shipping + tax - discount;

  useEffect(() => {
    const fetchLastOrder = async () => {
      if (user) {
        try {
          const res = await fetch("/api/orders/user?limit=1");
          const data = await res.json();
          if (res.ok && data.orders?.length > 0) {
            const prevAddr = data.orders[0].shippingAddress;
            setLastAddress(prevAddr);
            setUsePreviousAddress(true); 
            setFormData(prevAddr);
          } else {
            // Agar koi order nahi hai, toh buttons hide rahenge aur form auto-fill hoga basics ke saath
            setUsePreviousAddress(false);
            setFormData(prev => ({ ...prev, fullName: user.name || "", email: user.email || "" }));
          }
        } catch (e) { console.error(e); }
      }
    };
    if (!isLoading) fetchLastOrder();
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) router.replace("/login");
      else if (cart.length === 0 && !isPlacingOrder) router.replace("/cart");
    }
  }, [isLoggedIn, cart.length, isLoading, router, isPlacingOrder]);

  const showToast = (msg: string) => {
    setNotification({ message: msg, visible: true });
    setTimeout(() => setNotification({ message: "", visible: false }), 4000);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const val = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, phone: val }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "pincode" && value.length === 6) {
      setIsPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data[0].Status === "Success") setFormData(prev => ({ ...prev, state: data[0].PostOffice[0].State }));
      } catch (e) { console.error(e); }
      finally { setIsPincodeLoading(false); }
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || formData.phone.length < 10 || !formData.address) {
        showToast("Please check all required fields.");
        return;
    }
    setIsPlacingOrder(true);
    try {
      const dbUserId = user?.id || user?._id;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUserId,
          items: cart.map(item => ({ productId: item.id || (item as any).productId, name: item.name, image: item.image, size: item.size, quantity: item.quantity, price: item.price })),
          address: formData,
          subtotal, shippingCharge: shipping, tax, discount, total: finalTotal, paymentMethod
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      sessionStorage.setItem("lastOrder", JSON.stringify(data.order));
      router.push("/order-success");
    } catch (err: any) {
      showToast(err.message);
      setIsPlacingOrder(false);
    }
  };

  if (isLoading || !isLoggedIn) return <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#7B2D0A]" size={30} /></div>;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 pt-32 md:pt-40">
      <AnimatePresence>
        {notification.visible && (
          <motion.div initial={{ y: 50, opacity: 0, x: "-50%" }} animate={{ y: 0, opacity: 1, x: "-50%" }} exit={{ y: 50, opacity: 0, x: "-50%" }} className="fixed bottom-10 left-1/2 z-[300] bg-[#1C1C1C] text-[#D4AF37] px-8 py-4 rounded-2xl shadow-2xl border border-[#D4AF37]/20 flex items-center gap-4">
            <ShieldCheck size={18} className="text-red-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.1em]">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="mb-10 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-stone-100 rounded-full cursor-pointer transition-colors"><ChevronLeft size={20} /></button>
          <h1 className="text-2xl md:text-3xl font-serif text-stone-900 italic">Secure Checkout</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            
            {/* ADDRESS SECTION */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-stone-100">
              <SectionHeading icon={<MapPin size={18} />} title="Delivery Details" />
              
              {/* SAVED ADDRESS CARDS: Sirf tab dikhao jab lastAddress exist karta ho */}
              {lastAddress && (
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => { setUsePreviousAddress(true); setFormData(lastAddress); }}
                    className={`relative p-6 rounded-3xl border-2 text-left transition-all ${usePreviousAddress ? "border-[#7B2D0A] bg-[#7B2D0A]/5 shadow-md" : "border-stone-100"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#7B2D0A] uppercase tracking-widest">
                        <History size={14} /> Saved Address
                      </div>
                      {usePreviousAddress && <CheckCircle2 size={18} className="text-[#7B2D0A]" />}
                    </div>
                    <p className="font-bold text-stone-900 text-sm">{lastAddress.fullName}</p>
                    <p className="text-[11px] font-bold text-stone-700">{lastAddress.phone}</p>
                    <p className="text-xs text-stone-500 mt-1 italic font-serif">{lastAddress.address}, {lastAddress.area}, {lastAddress.state} - {lastAddress.pincode}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUsePreviousAddress(false); }}
                    className={`p-6 rounded-3xl border-2 border-dashed flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all ${!usePreviousAddress ? "border-[#7B2D0A] text-[#7B2D0A] bg-[#7B2D0A]/5" : "border-stone-200 text-stone-400"}`}
                  >
                    <Plus size={16} /> New Address
                  </button>
                </div>
              )}

              {/* FORM: Tab dikhao jab usePreviousAddress false ho YA user bilkul naya ho */}
              {(!usePreviousAddress || !lastAddress) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <InputField label="Full Name *" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                    <div className="relative">
                      <InputField label="Mobile Number *" name="phone" value={formData.phone} onChange={handleInputChange} />
                      <style jsx>{` input { padding-left: 32px !important; } `}</style>
                    </div>
                    <div className="md:col-span-2"><InputField label="Email Address *" name="email" value={formData.email} onChange={handleInputChange} /></div>
                    <div className="md:col-span-2"><InputField label="House/Building Name *" name="address" value={formData.address} onChange={handleInputChange} /></div>
                    <InputField label="Area / Locality *" name="area" value={formData.area} onChange={handleInputChange} />
                    <InputField label="Pincode *" name="pincode" value={formData.pincode} onChange={handleInputChange} maxLength={6} />
                    <InputField label={isPincodeLoading ? "..." : "State *"} name="state" value={formData.state} readOnly />
                  </div>
                  <div className="flex gap-4">
                    <TypeBadge active={formData.addressType === "home"} onClick={() => setFormData(p => ({...p, addressType: "home"}))} icon={<Home size={14} />} label="Home" />
                    <TypeBadge active={formData.addressType === "work"} onClick={() => setFormData(p => ({...p, addressType: "work"}))} icon={<Briefcase size={14} />} label="Office" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-stone-100">
              <SectionHeading icon={<CreditCard size={18} />} title="Payment Method" />
              <div className="space-y-4">
                <PaymentOption id="upi" label="UPI / Digital Wallet" icon={<Wallet size={18} />} active={paymentMethod === "upi"} onClick={setPaymentMethod} />
                <PaymentOption id="cod" label="Cash on Delivery" icon={<Banknote size={18} />} active={paymentMethod === "cod"} onClick={setPaymentMethod} />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-5 lg:sticky lg:top-40">
            <div className="bg-[#1C1C1C] text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative">
              <button 
                type="button" 
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)} 
                className="w-full flex items-center justify-between mb-8 group border-b border-white/10 pb-4"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">Order Review</p>
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <span className="text-[10px] font-bold uppercase">{cart.length} Items</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isSummaryExpanded ? "rotate-180" : ""}`} />
                </div>
              </button>

              <AnimatePresence>
                {isSummaryExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-6 mb-8 max-h-[260px] overflow-y-auto no-scrollbar border-b border-white/10 pb-8">
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center">
                          <img src={item.image} className="w-12 h-16 object-cover rounded-xl bg-white/5 border border-white/10" alt={item.name} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold uppercase truncate tracking-tight">{item.name}</p>
                            <p className="text-[9px] text-stone-500 mt-1 font-bold uppercase tracking-widest">Size {item.size} · Qty {item.quantity}</p>
                          </div>
                          <p className="text-xs font-bold font-poppins text-[#D4AF37]">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-500"><span>Subtotal</span><span className="text-white">₹{subtotal.toLocaleString()}</span></div>
                {discount > 0 && <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-green-500"><span>Discount</span><span>- ₹{discount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-500"><span>GST</span><span className="text-white">₹{tax.toLocaleString()}</span></div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-500"><span>Delivery</span><span className={shipping === 0 ? "text-green-500 font-black" : "text-white"}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 block mb-1">Grand Total</span>
                    <span className="text-4xl font-serif text-[#D4AF37]">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isPlacingOrder} className="w-full mt-10 py-6 bg-[#D4AF37] text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl disabled:opacity-50">
                {isPlacingOrder ? <Loader2 className="animate-spin" /> : <>Complete Order <ArrowRight size={16} /></>}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

// Helpers
function SectionHeading({ icon, title }: any) { return <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-50"><div className="p-2 bg-[#7B2D0A]/5 rounded-lg text-[#7B2D0A]">{icon}</div><h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">{title}</h2></div>; }
function InputField({ label, ...props }: any) { return <div className="relative group"><input {...props} className="peer w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-[#7B2D0A] transition-all text-sm font-medium placeholder-transparent" placeholder={label} /><label className="absolute left-0 -top-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[#7B2D0A] pointer-events-none uppercase">{label}</label></div>; }
function PaymentOption({ id, label, icon, active, onClick }: any) { return <button type="button" onClick={() => onClick(id)} className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${active ? "border-[#7B2D0A] bg-[#7B2D0A]/5" : "border-stone-100"}`}><div className="flex items-center gap-4"><div className={`p-2.5 rounded-xl ${active ? "bg-[#7B2D0A] text-white" : "bg-stone-100 text-stone-400"}`}>{icon}</div><p className={`text-xs font-bold uppercase tracking-tight ${active ? "text-stone-900" : "text-stone-500"}`}>{label}</p></div></button>; }
function TypeBadge({ active, onClick, icon, label }: any) { return <button type="button" onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${active ? "bg-black text-white" : "bg-stone-50 text-stone-400"}`}> {icon} {label} </button>; }