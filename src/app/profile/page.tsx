"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  Home, 
  Briefcase, 
  X, 
  ChevronDown,
  ShieldCheck 
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function ProfilePage() {
  const { isLoggedIn, isLoading, user } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

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
    gstNumber: "",
  });

  const dbUserId = user?.id || user?._id;

  const showToast = (msg: string) => {
    setNotification({ message: msg, visible: true });
    setTimeout(() => setNotification({ message: "", visible: false }), 4000);
  };

  const fetchAddresses = async () => {
    if (!dbUserId) return;
    try {
      const res = await fetch(`/api/user/addresses?userId=${dbUserId}`);
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (e) {
      console.error("Failed fetching profile address pool", e);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.replace("/login");
      } else {
        fetchAddresses();
      }
    }
  }, [isLoggedIn, isLoading, dbUserId]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, phone: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }
    if (name === "pincode") {
      const numericVal = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, pincode: numericVal }));
      if (numericVal.length === 6) {
        setIsPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${numericVal.trim()}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.[0]) {
            const matchedState = INDIAN_STATES.find((s) => s.toLowerCase() === data[0].PostOffice[0].State.toLowerCase()) || data[0].PostOffice[0].State;
            setFormData((prev) => ({ ...prev, state: matchedState }));
          }
        } catch (e) {
          showToast("Failed to fetch state code.");
        } finally {
          setIsPincodeLoading(false);
        }
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingAddressId(null);
    setFormData({
      fullName: user?.name || "",
      phone: "",
      email: user?.email || "",
      address: "",
      area: "",
      landmark: "",
      state: "",
      pincode: "",
      addressType: "home",
      gstNumber: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (addr: any) => {
    setEditingAddressId(addr._id);
    setFormData(addr);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to completely erase this address?")) return;
    try {
      const res = await fetch(`/api/user/addresses?addressId=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Address deleted successfully.");
        fetchAddresses();
      }
    } catch (err) {
      showToast("Could not drop address execution.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || formData.phone.length < 10 || !formData.address || !formData.pincode || !formData.state) {
      showToast("Please fill all necessary attributes.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUserId,
          addressId: editingAddressId,
          ...formData
        }),
      });
      const result = await res.json();
      if (result.success) {
        showToast(editingAddressId ? "Address updated successfully." : "New address registered.");
        setIsModalOpen(false);
        fetchAddresses();
      }
    } catch (err) {
      showToast("Something went wrong saving records.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isPageLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#7B2D0A]" size={30} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 pt-32 md:pt-40">
      <AnimatePresence>
        {notification.visible && (
          <motion.div initial={{ y: 50, opacity: 0, x: "-50%" }} animate={{ y: 0, opacity: 1, x: "-50%" }} exit={{ y: 50, opacity: 0, x: "-50%" }} className="fixed bottom-10 left-1/2 z-[300] bg-[#1C1C1C] text-[#D4AF37] px-8 py-4 rounded-2xl shadow-2xl border border-[#D4AF37]/20 flex items-center gap-4">
            <ShieldCheck size={18} className="text-[#7B2D0A]" />
            <p className="text-[11px] font-black uppercase tracking-[0.1em]">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[900px] mx-auto px-4 md:px-8">
        {/* Profile Identity Heading Widget */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-stone-100 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-[#7B2D0A]/5 border border-[#7B2D0A]/10 flex items-center justify-center text-[#7B2D0A]">
            <User size={40} className="stroke-[1.25]" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-serif text-stone-900 italic font-medium">{user?.name || "Bannira Patron"}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-stone-500 text-sm">
              <Mail size={15} className="text-stone-400" />
              <span>{user?.email || "customer@bannira.com"}</span>
            </div>
          </div>
        </div>

        {/* Saved Addresses Controller Panel Layout */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-stone-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#7B2D0A]/5 rounded-xl text-[#7B2D0A]"><MapPin size={18} /></div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">Registered Shipping Profiles</h2>
            </div>
            <button type="button" onClick={openAddModal} className="px-5 py-3 bg-[#7B2D0A] text-white hover:bg-black rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all self-start sm:self-auto shadow-sm">
              <Plus size={14} /> Add New Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-stone-100 rounded-[2rem] bg-stone-50/50">
              <MapPin size={32} className="mx-auto text-stone-300 mb-3 stroke-[1.5]" />
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">No Addresses Registered Yet</p>
              <p className="text-xs text-stone-400 font-serif italic mt-1">Add your target addresses for a lightning-fast checkout sequence.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr._id} className="p-6 rounded-3xl border border-stone-100 bg-stone-50/30 hover:bg-stone-50/80 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-extrabold px-2 py-0.5 bg-white border border-stone-200 text-stone-600 rounded-md uppercase tracking-wider flex items-center gap-1">
                        {addr.addressType === "home" ? <Home size={10} /> : <Briefcase size={10} />} {addr.addressType}
                      </span>
                    </div>
                    <p className="font-bold text-stone-900 text-sm truncate">{addr.fullName}</p>
                    <p className="text-[11px] font-bold text-stone-600 mt-0.5">{addr.phone}</p>
                    <p className="text-xs text-stone-500 mt-2 italic font-serif leading-relaxed line-clamp-3">{addr.address}, {addr.area}, {addr.state} - {addr.pincode}</p>
                    {addr.gstNumber && <p className="text-[9px] font-mono text-[#D4AF37] font-bold mt-2 uppercase">GSTIN: {addr.gstNumber}</p>}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-stone-100/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => openEditModal(addr)} className="p-2.5 bg-white rounded-xl border border-stone-200 hover:text-blue-600 shadow-sm hover:border-blue-200 transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-3"><Edit2 size={11} /> Edit</button>
                    <button type="button" onClick={() => handleDeleteAddress(addr._id)} className="p-2.5 bg-white rounded-xl border border-stone-200 hover:text-red-600 shadow-sm hover:border-red-200 transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-3"><Trash2 size={11} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Modal Overlay Context Wrapper Block */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            
            <motion.div initial={{ scale: 0.95, y: 15, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 15, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-[650px] overflow-hidden shadow-2xl relative z-10 border border-stone-100 max-h-[90vh] flex flex-col">
              <div className="p-6 md:p-8 border-b border-stone-100 flex items-center justify-between bg-[#FAF9F6]">
                <h3 className="font-serif italic text-xl text-stone-900">{editingAddressId ? "Modify Shipping Profile" : "Create Shipping Profile"}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-200/60 rounded-full text-stone-400 hover:text-stone-700 transition-colors"><X size={18} /></button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-8 overflow-y-auto no-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <InputField label="Full Name *" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                  <InputField label="Mobile Number *" name="phone" value={formData.phone} onChange={handleInputChange} />
                  <div className="md:col-span-2"><InputField label="Email Address *" name="email" value={formData.email} onChange={handleInputChange} /></div>
                  <div className="md:col-span-2"><InputField label="Shipping Address *" name="address" value={formData.address} onChange={handleInputChange} /></div>
                  <InputField label="Area / Locality *" name="area" value={formData.area} onChange={handleInputChange} />
                  <InputField label="Pincode *" name="pincode" value={formData.pincode} onChange={handleInputChange} maxLength={6} />

                  <div className="relative group border-b border-stone-200 py-1 focus-within:border-[#7B2D0A] transition-all">
                    <label className="absolute left-0 -top-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 pointer-events-none">{isPincodeLoading ? "Locating Matrix..." : "State *"}</label>
                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-transparent outline-none text-sm font-medium py-2 pr-8 appearance-none cursor-pointer text-stone-900">
                      <option value="" disabled>Select state region</option>
                      {INDIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>

                  <div className="md:col-span-2"><InputField label="GSTIN Number (Optional)" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} maxLength={15} /></div>
                </div>

                <div className="flex gap-4 pt-2">
                  <TypeBadge active={formData.addressType === "home"} onClick={() => setFormData((p) => ({ ...p, addressType: "home" }))} icon={<Home size={13} />} label="Home" />
                  <TypeBadge active={formData.addressType === "work"} onClick={() => setFormData((p) => ({ ...p, addressType: "work" }))} icon={<Briefcase size={13} />} label="Office" />
                </div>

                <div className="pt-6 border-t border-stone-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-4 bg-stone-100 hover:bg-stone-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-600 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-8 py-4 bg-[#7B2D0A] hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md disabled:opacity-40 cursor-pointer">
                    {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : "Save Profile"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <div className="relative group">
      <input {...props} className="peer w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-[#7B2D0A] transition-all text-sm font-medium placeholder-transparent text-stone-900" placeholder={label} />
      <label className="absolute left-0 -top-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[#7B2D0A] pointer-events-none">{label}</label>
    </div>
  );
}

function TypeBadge({ active, onClick, icon, label }: any) {
  return (
    <button type="button" onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${active ? "bg-black text-white" : "bg-stone-50 text-stone-400"}`}> {icon} {label} </button>
  );
}