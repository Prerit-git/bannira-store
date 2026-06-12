"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowRight, ShieldCheck, CheckSquare, Square, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BulkOrdersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [toast, setToast] = useState({ message: "", visible: false });

  const [businessForm, setBusinessForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    gstNumber: "",
    message: "",
  });

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setIsCatalogLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        const catalogItems = Array.isArray(data) ? data : data.products || [];
        setProducts(catalogItems);
      } catch (err) {
        console.error("Failed to load wholesale gallery view:", err);
      } finally {
        setIsCatalogLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 4000);
  };

  const handleProductSelectToggle = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleSubmitBulkLead = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessForm.name || !businessForm.phone || !businessForm.email) {
      showToast("Please check mandatory business profile information inputs.");
      return;
    }

    if (businessForm.phone.length !== 10) {
    showToast("Mobile number must be exactly 10 digits long.");
    return;
  }

    if (selectedProductIds.length === 0) {
      showToast("Please select at least 1 design sample from catalog below.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Map complete schemas arrays from matching indexes pointers safely
      const selectedItemsPayload = products
        .filter((p) => selectedProductIds.includes(p._id || p.id))
        .map((p) => ({
          productId: p._id || p.id,
          name: p.name,
          image: p.image || p.images?.[0],
          price: Number(p.price),
        }));

      const res = await fetch("/api/bulk-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...businessForm,
          items: selectedItemsPayload,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Network response parsing failed.");

      showToast("Successfully Submitted! Our wholesale team will call you within 24 hours.");
      setBusinessForm({ name: "", companyName: "", email: "", phone: "", gstNumber: "", message: "" });
      setSelectedProductIds([]);
    } catch (error: any) {
      showToast(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 pt-32 md:pt-40 font-poppins text-stone-900 selection:bg-stone-100">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ y: 50, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 50, opacity: 0, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[300] bg-[#1C1C1C] text-[#D4AF37] px-8 py-4 rounded-2xl shadow-2xl border border-[#D4AF37]/20 flex items-center gap-4 text-[11px] font-black uppercase tracking-wider"
          >
            <Info size={16} className="text-[#D4AF37]" />
            <p>{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6">
        <header className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#7B2D0A]">Bannira Wholesale Portal</span>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-900 italic">Bulk Order Enquiry</h1>
          <p className="text-stone-400 text-xs leading-relaxed">Choose your favorite dress designs, check the boxes for what you need, and enter the total number of items you want to order.</p>
        </header>

        <form onSubmit={handleSubmitBulkLead} className="space-y-12">
          {/* Section 1: Corporate Profile Metadata Fields */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-stone-100 shadow-xs space-y-8">
            <div className="pb-3 border-b border-stone-100 flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-stone-900">1. Business Profile Information</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="relative group border-b border-stone-200 py-2 focus-within:border-[#7B2D0A] transition-all">
                <input required type="text" value={businessForm.name} onChange={e => setBusinessForm({...businessForm, name: e.target.value})} className="w-full bg-transparent outline-none text-sm font-medium py-1 placeholder-stone-300" placeholder="Contact Person Name *" />
              </div>
              <div className="relative group border-b border-stone-200 py-2 focus-within:border-[#7B2D0A] transition-all">
                <input type="text" value={businessForm.companyName} onChange={e => setBusinessForm({...businessForm, companyName: e.target.value})} className="w-full bg-transparent outline-none text-sm font-medium py-1 placeholder-stone-300" placeholder="Company / Brand Name (Optional)" />
              </div>
              <div className="relative group border-b border-stone-200 py-2 focus-within:border-[#7B2D0A] transition-all">
                <input required type="email" value={businessForm.email} onChange={e => setBusinessForm({...businessForm, email: e.target.value})} className="w-full bg-transparent outline-none text-sm font-medium py-1 placeholder-stone-300" placeholder="Business Email Address *" />
              </div>
              <div className="relative group border-b border-stone-200 py-2 focus-within:border-[#7B2D0A] transition-all">
                <input required type="tel" maxLength={10} value={businessForm.phone} onChange={e => {
      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
      setBusinessForm({...businessForm, phone: val});
    }}className="w-full bg-transparent outline-none text-sm font-medium py-1 placeholder-stone-300" placeholder="Mobile Whatsapp Number *" />
              </div>
              <div className="md:col-span-2 relative group border-b border-stone-200 py-2 focus-within:border-[#7B2D0A] transition-all">
                <input type="text" value={businessForm.gstNumber} maxLength={15} onChange={e => setBusinessForm({...businessForm, gstNumber: e.target.value.toUpperCase()})} className="w-full bg-transparent outline-none text-sm font-medium py-1 uppercase placeholder-stone-300" placeholder="Corporate GSTIN ID (Optional)" />
              </div>
              <div className="md:col-span-2 relative group border-b border-stone-200 py-2 focus-within:border-[#7B2D0A] transition-all">
                <textarea rows={3} value={businessForm.message} onChange={e => setBusinessForm({...businessForm, message: e.target.value})} className="w-full bg-transparent outline-none text-sm font-medium py-1 resize-none placeholder-stone-300" placeholder="Describe any custom detailing variants requirements, color swatches or scaling specifications (Optional)..." />
              </div>
            </div>
          </div>

          {/* Section 2: Catalog Checkboxes Selection Matrix Engine Grid */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-stone-100 shadow-xs space-y-6">
            <div className="pb-3 border-b border-stone-100 flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-stone-900">2. Select your preferences (Select atleast one)</span>
              <span className="text-[10px] font-bold font-mono text-stone-400 bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                Selected: {selectedProductIds.length} Designs
              </span>
            </div>

            {isCatalogLoading ? (
              <div className="py-20 flex justify-center items-center">
                <Loader2 className="animate-spin text-[#7B2D0A]" size={24} />
              </div>
            ) : products.length === 0 ? (
              <p className="text-center py-12 text-xs font-semibold italic text-stone-300">Catalog is temporarily offline.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pt-4">
                {products.map((prod) => {
                  const targetId = prod._id || prod.id;
                  const isChecked = selectedProductIds.includes(targetId);
                  const coverImage = prod.image || prod.images?.[0] || "/placeholder.jpg";
                  
                  return (
                    <div 
                      key={targetId}
                      onClick={() => handleProductSelectToggle(targetId)}
                      className={`group relative rounded-2xl overflow-hidden bg-[#F9F9F9] border cursor-pointer select-none transition-all duration-300 hover:shadow-md
                        ${isChecked ? "border-[#7B2D0A] ring-1 ring-[#7B2D0A]/30 bg-[#7B2D0A]/[0.01]" : "border-stone-100 bg-white"}`}
                    >
                      {/* Checkbox overlay button indicators graphic links anchor */}
                      <div className="absolute top-3 left-3 z-30 transition-all">
                        {isChecked ? (
                          <div className="p-1 bg-[#7B2D0A] text-white rounded-md shadow-xs"><CheckSquare size={14} /></div>
                        ) : (
                          <div className="p-1 bg-white/80 backdrop-blur-md text-stone-400 rounded-md border border-stone-200/40 shadow-2xs group-hover:text-stone-700 group-hover:bg-white"><Square size={14} /></div>
                        )}
                      </div>

                      {/* Cover Asset Image visual layer placeholder alignment row */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
                        <img 
                          src={coverImage} 
                          alt={prod.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                        />
                      </div>

                      {/* Content Card fields tracking typography summaries parameters */}
                      <div className="p-3 font-poppins flex flex-col min-h-[90px]">
                        <span className="text-[8px] font-black tracking-widest text-stone-400 uppercase mb-0.5 truncate">{prod.category || "Ethnic"}</span>
                        <h4 className="text-[11px] font-serif font-medium text-stone-800 tracking-tight line-clamp-2 leading-tight flex-1 mb-1">{prod.name}</h4>
                        <span className="text-xs font-bold text-stone-900 font-mono">₹{prod.price?.toLocaleString("en-IN")} <span className="text-[9px] text-stone-400 font-normal">MRP</span></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submission confirmation pipeline controls configuration modules array tracker links wrapper */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isCatalogLoading}
              className="bg-[#7B2D0A] hover:bg-stone-800 disabled:bg-stone-200 text-white font-bold px-12 py-5 rounded-full text-[11px] tracking-[0.3em] uppercase transition-all duration-300 flex items-center gap-3 shadow-md active:scale-98 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  Submit <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}