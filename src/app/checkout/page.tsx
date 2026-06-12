"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script"; // 1. External Razorpay script load karne ke liye
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
  Plus,
  History,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, totalPrice, discount, clearCart } = useCart();
  const { isLoggedIn, isLoading, user } = useAuth();
  const router = useRouter();

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [usePreviousAddress, setUsePreviousAddress] = useState(false);
  const [lastAddress, setLastAddress] = useState<any>(null);
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  });

  // Store dynamic settings state
  const [shippingCost, setShippingCost] = useState(150);
  const [shippingFreeLimit, setShippingFreeLimit] = useState(2999);
  const [gstPercentage, setGstPercentage] = useState(18);

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
    const fetchInitialData = async () => {
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
            setUsePreviousAddress(false);
            setFormData((prev) => ({
              ...prev,
              fullName: user.name || "",
              email: user.email || "",
            }));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const result = await res.json();
        if (result.success && result.data) {
          const data = result.data;
          if (data.shippingCost !== undefined)
            setShippingCost(data.shippingCost);
          if (data.shippingFreeLimit !== undefined)
            setShippingFreeLimit(data.shippingFreeLimit);
          if (data.gstPercentage !== undefined)
            setGstPercentage(data.gstPercentage);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };

    if (!isLoading) {
      fetchInitialData();
      fetchSettings();
    }
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

  const subtotal = totalPrice;
  const shipping =
    subtotal >= shippingFreeLimit || subtotal === 0 ? 0 : shippingCost;
  const tax = Math.round(subtotal * (gstPercentage / 100));
  const finalTotal = subtotal + shipping + tax - discount;

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const val = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: val }));
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Pincode strict verification block
    if (name === "pincode" && value.length === 6) {
      setIsPincodeLoading(true);
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value.trim()}`
        );
        
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.[0]) {
          setFormData((prev) => ({
            ...prev,
            state: data[0].PostOffice[0].State,
          }));
        } else {
          console.warn("Pincode API returned empty or unsuccessful status");
        }
      } catch (e) {
        console.error("Pincode Fetch Error:", e);
        showToast("Something went wrong. Please enter state manually.");
      } finally {
        setIsPincodeLoading(false);
      }
    }
  };

  // 2. MODIFIED ORDER & PAYMENT GATEWAY FLOW
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || formData.phone.length < 10 || !formData.address) {
      showToast("Please check all required fields.");
      return;
    }
    
    setIsPlacingOrder(true);

    try {
      const dbUserId = user?.id || user?._id;
      
      // Order payload common object
      const orderPayload = {
        userId: dbUserId,
        items: cart.map((item) => ({
          productId: item.id || (item as any).productId,
          name: item.name,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        address: formData,
        subtotal,
        shippingCharge: shipping,
        tax,
        discount,
        total: finalTotal,
        paymentMethod,
      };

      // --- CASE A: CASH ON DELIVERY ---
      if (paymentMethod === "cod") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        sessionStorage.setItem("lastOrder", JSON.stringify(data.order));
        if (clearCart) clearCart(); // Safety check
        router.push("/order-success");
        return;
      }

      // --- CASE B: ONLINE PAYMENT (RAZORPAY) ---
      // Pehle backend se secure transaction id / order verify karwayein
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderPayload, isOnlinePaymentInit: true }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order generation failed");

      // Razorpay implementation setup parameters
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "BANNIRA",
        description: "Premium Ethnic Wear Purchase",
        image: "/bannira_web_logo2.png",
        order_id: data.razorpayOrder.id, 
        handler: async function (response: any) {
  try {
    const verifyRes = await fetch("/api/orders/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: data.order._id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");

    sessionStorage.setItem("lastOrder", JSON.stringify(verifyData.order));
    if (clearCart) clearCart();
    router.push("/order-success");
  } catch (verifyErr: any) {
    showToast(verifyErr.message || "Payment authentication failed");
    setIsPlacingOrder(false);
  }
},
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#7B2D0A", // Custom core brand identity theme injection
        },
        modal: {
          ondismiss: function () {
            setIsPlacingOrder(false); // Modal cancel hone par loader close karein
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      showToast(err.message || "Something went wrong.");
      setIsPlacingOrder(false);
    }
  };

  if (isLoading || !isLoggedIn)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#7B2D0A]" size={30} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 pt-32 md:pt-40">
      {/* Script component explicitly fetching runtime dependencies code libraries */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ y: 50, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 50, opacity: 0, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[300] bg-[#1C1C1C] text-[#D4AF37] px-8 py-4 rounded-2xl shadow-2xl border border-[#D4AF37]/20 flex items-center gap-4"
          >
            <ShieldCheck size={18} className="text-red-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.1em]">
              {notification.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="mb-10 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-stone-100 rounded-full cursor-pointer transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-serif text-stone-900 italic">
            Secure Checkout
          </h1>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-stone-100">
              <SectionHeading
                icon={<MapPin size={18} />}
                title="Delivery Details"
              />

              {lastAddress && (
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => {
                      setUsePreviousAddress(true);
                      setFormData(lastAddress);
                    }}
                    className={`relative p-6 rounded-3xl border-2 text-left transition-all ${usePreviousAddress ? "border-[#7B2D0A] bg-[#7B2D0A]/5 shadow-md" : "border-stone-100"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#7B2D0A] uppercase tracking-widest">
                        <History size={14} /> Saved Address
                      </div>
                      {usePreviousAddress && (
                        <CheckCircle2 size={18} className="text-[#7B2D0A]" />
                      )}
                    </div>
                    <p className="font-bold text-stone-900 text-sm">
                      {lastAddress.fullName}
                    </p>
                    <p className="text-[11px] font-bold text-stone-700">
                      {lastAddress.phone}
                    </p>
                    <p className="text-xs text-stone-500 mt-1 italic font-serif">
                      {lastAddress.address}, {lastAddress.area},{" "}
                      {lastAddress.state} - {lastAddress.pincode}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsePreviousAddress(false);
                    }}
                    className={`p-6 rounded-3xl border-2 border-dashed flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all ${!usePreviousAddress ? "border-[#7B2D0A] text-[#7B2D0A] bg-[#7B2D0A]/5" : "border-stone-200 text-stone-400"}`}
                  >
                    <Plus size={16} /> New Address
                  </button>
                </div>
              )}

              {(!usePreviousAddress || !lastAddress) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <InputField
                      label="Full Name *"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    <div className="relative">
                      <InputField
                        label="Mobile Number *"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        label="Email Address *"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        label="House/Building Name *"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <InputField
                      label="Area / Locality *"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Pincode *"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                    />
                    <InputField
                      label={isPincodeLoading ? "..." : "State *"}
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex gap-4">
                    <TypeBadge
                      active={formData.addressType === "home"}
                      onClick={() =>
                        setFormData((p) => ({ ...p, addressType: "home" }))
                      }
                      icon={<Home size={14} />}
                      label="Home"
                    />
                    <TypeBadge
                      active={formData.addressType === "work"}
                      onClick={() =>
                        setFormData((p) => ({ ...p, addressType: "work" }))
                      }
                      icon={<Briefcase size={14} />}
                      label="Office"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-stone-100">
              <SectionHeading
                icon={<CreditCard size={18} />}
                title="Payment Method"
              />
              <div className="space-y-4">
                <PaymentOption
                  id="upi"
                  label="UPI / Digital Wallet"
                  icon={<Wallet size={18} />}
                  active={paymentMethod === "upi"}
                  onClick={setPaymentMethod}
                />
                <PaymentOption
                  id="cod"
                  label="Cash on Delivery"
                  icon={<Banknote size={18} />}
                  active={paymentMethod === "cod"}
                  onClick={setPaymentMethod}
                />
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
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
                  Order Review
                </p>
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <span className="text-[10px] font-bold uppercase">
                    {cart.length} Items
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isSummaryExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isSummaryExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-6 mb-8 max-h-[260px] overflow-y-auto no-scrollbar border-b border-white/10 pb-8">
                      {cart.map((item) => (
                        <div
                          key={`${item.id}-${item.size}`}
                          className="flex gap-4 items-center"
                        >
                          <img
                            src={item.image}
                            className="w-12 h-16 object-cover rounded-xl bg-white/5 border border-white/10"
                            alt={item.name}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold uppercase truncate tracking-tight">
                              {item.name}
                            </p>
                            <p className="text-[9px] text-stone-500 mt-1 font-bold uppercase tracking-widest">
                              Size {item.size} · Qty {item.quantity}
                            </p>
                          </div>
                          <p className="text-xs font-bold font-poppins text-[#D4AF37]">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-500">
                  <span>Subtotal</span>
                  <span className="text-white">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-green-600">
                    <span>Discount</span>
                    <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-500">
                  <span>Tax ({gstPercentage}%)</span>
                  <span className="text-white">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-500">
                  <span>Delivery</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-green-600 font-black"
                        : "text-white"
                    }
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 block mb-1">
                      Grand Total
                    </span>
                    <span className="text-4xl font-serif text-[#D4AF37]">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full mt-10 py-6 bg-[#D4AF37] text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl disabled:opacity-50 cursor-pointer"
              >
                {isPlacingOrder ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Complete Order <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title }: any) {
  return (
    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
      <div className="p-2 bg-[#7B2D0A]/5 rounded-lg text-[#7B2D0A]">{icon}</div>
      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">
        {title}
      </h2>
    </div>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <div className="relative group">
      <input
        {...props}
        className="peer w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-[#7B2D0A] transition-all text-sm font-medium placeholder-transparent"
        placeholder={label}
      />
      <label className="absolute left-0 -top-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[#7B2D0A] pointer-events-none">
        {label}
      </label>
    </div>
  );
}

function PaymentOption({ id, label, icon, active, onClick }: any) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all cursor-pointer ${active ? "border-[#7B2D0A] bg-[#7B2D0A]/5" : "border-stone-100"}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2.5 rounded-xl ${active ? "bg-[#7B2D0A] text-white" : "bg-stone-100 text-stone-400"}`}
        >
          {icon}
        </div>
        <p
          className={`text-xs font-bold uppercase tracking-tight ${active ? "text-stone-900" : "text-stone-500"}`}
        >
          {label}
        </p>
      </div>
    </button>
  );
}

function TypeBadge({ active, onClick, icon, label }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${active ? "bg-black text-white" : "bg-stone-50 text-stone-400"}`}
    >
      {" "}
      {icon} {label}{" "}
    </button>
  );
}