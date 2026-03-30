"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ChevronLeft,
  ShoppingBag,
  Heart,
  Ruler,
  ShieldCheck,
  Truck,
  Plus,
  Shirt,
  Droplets,
  MapPin,
  Gift,
  ArrowRight,
  Share2,
} from "lucide-react";
import { products, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface AccordionItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  // Mobile Scroll logic for Sticky Mini-Header
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [400, 500], [0, 1]);
  const headerY = useTransform(scrollY, [400, 500], [-20, 0]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const found = products.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setSelectedImage(0);
    }
  }, [id]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 5);
  }, [product]);

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF9F6]">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="font-serif italic text-[#7B2D0A] text-xl"
        >
          Opening the Vault...
        </motion.div>
      </div>
    );

  const images = product.images || [product.image];

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-20 md:pt-40 pb-32 md:pb-20 selection:bg-[#7B2D0A] selection:text-white">
      {/* MOBILE STICKY MINI-HEADER (Premium Feel) */}
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="fixed top-28 inset-x-0 z-[60] bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:hidden flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#7B2D0A] uppercase tracking-tighter truncate w-full">
            {product.name}
          </span>
          <span className="text-sm font-bold text-[#2A1A12]">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <button className="bg-[#7B2D0A] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Add to bag
        </button>
      </motion.div>

      <div className="max-w-350 mx-auto px-0 md:px-8">
        {/* BACK NAVIGATION (Hidden on mobile scroll for space) */}
        <div className="px-4 md:px-0">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#7B2D0A] hover:text-[#D4AF37] mb-6 transition-colors"
          >
            <ChevronLeft size={14} /> Back to Collection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 xl:gap-16 items-start">
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Desktop Thumbnails (Hidden on Mobile) */}
            <div className="hidden md:flex md:flex-col gap-3 overflow-y-auto no-scrollbar max-h-[700px]">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative flex-shrink-0 w-24 aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-[#7B2D0A]"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage (Mobile: Horizontal Snap Scroll) */}
            <div className="relative w-full md:flex-1 aspect-[4/5] md:aspect-[3/4] bg-white overflow-hidden md:rounded-sm shadow-sm">
              <div
                className="flex md:hidden h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
                onScroll={(e: any) => {
                  const idx = Math.round(
                    e.target.scrollLeft / e.target.offsetWidth,
                  );
                  setSelectedImage(idx);
                }}
              >
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full flex-shrink-0 snap-center"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Desktop Image Display */}
              <div className="hidden md:block h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>

              {/* Mobile Image Counter (Dots) */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 transition-all rounded-full ${selectedImage === idx ? "w-6 bg-[#7B2D0A]" : "w-1.5 bg-gray-300"}`}
                  />
                ))}
              </div>

              {/* Badges & Share */}
              {product.badge && (
                <div className="absolute top-4 left-4 bg-[#7B2D0A] text-[#D4AF37] px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase">
                  {product.badge}
                </div>
              )}
              <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white md:hidden">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-5 px-4 md:px-0 lg:sticky lg:top-28">
            <div className="bg-white p-6 md:p-8 md:border md:border-[#D4AF37]/20 md:shadow-xl md:shadow-[#7B2D0A]/5 space-y-6 md:space-y-8 rounded-2xl md:rounded-sm">
              <section>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-2">
                  {product.category}
                </p>
                <h1 className="text-2xl md:text-4xl font-serif text-[#2A1A12] leading-tight mb-3">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-[#7B2D0A]">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </section>

              {/* Mobile Size Selection (Horizontal Scroll) */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Select Fit
                  </span>
                  {/* <button className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                    <Ruler size={14} /> Size Chart
                  </button> */}
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[56px] h-14 flex items-center justify-center text-sm font-bold transition-all border-2 rounded-xl ${
                        selectedSize === size
                          ? "bg-[#7B2D0A] border-[#7B2D0A] text-white shadow-lg"
                          : "border-gray-100 text-gray-400 bg-gray-50/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>

              {/* Desktop Actions (Hidden on mobile footer) */}
              <section className="hidden md:flex flex-col gap-3">
                <button className="w-full bg-[#7B2D0A] text-[#F3E1B6] py-5 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#D4AF37] hover:text-[#7B2D0A] transition-all shadow-lg">
                  <ShoppingBag size={18} /> Add To Bag
                </button>
                <button className="w-full border border-[#7B2D0A] text-[#7B2D0A] py-5 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3">
                  <Heart size={18} /> Wishlist
                </button>
              </section>

              <section className="pt-4 border-t border-gray-100 space-y-1">
                <AccordionItem
                  id="details"
                  title="Product Description"
                  icon={<Shirt size={18} />}
                  open={openAccordion === "details"}
                  onToggle={toggleAccordion}
                >
                  <p className="text-gray-600 italic mb-4">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 text-[11px] font-medium uppercase tracking-tighter text-gray-500">
                    <span>Fit: Regular</span>
                    <span>Fabric: Silk Blend</span>
                    <span>Length: 44 inches</span>
                    <span>Pattern: Printed</span>
                  </div>
                </AccordionItem>

                <AccordionItem
                  id="fabric"
                  title="Fabric & Care"
                  icon={<Droplets size={18} />}
                  open={openAccordion === "fabric"}
                  onToggle={toggleAccordion}
                >
                  <p className="text-gray-600 leading-relaxed">
                    Dry Clean Only recommended to maintain the luster and
                    embroidery quality.
                  </p>
                </AccordionItem>
              </section>

              {/* Badges (Icons only on mobile for space) */}
              <section className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-[#D4AF37]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                    Authentic
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={18} className="text-[#D4AF37]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                    Insured Delivery
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: SIMILAR PRODUCTS */}
        <section className="mt-20 md:mt-32 px-4 md:px-0 pt-10 border-t border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-8 md:mb-16">
            <div className="flex flex-col">
              <span className="text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.4em] mb-1">
                Tailored for you
              </span>
              <h2 className="text-2xl md:text-4xl font-serif text-[#2A1A12]">
                Similar Collection
              </h2>
            </div>
            <Link
              href="/products"
              className="text-[10px] font-bold uppercase tracking-widest text-[#7B2D0A] flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex md:grid md:grid-cols-5 gap-3 md:gap-6 overflow-x-auto no-scrollbar pb-8">
            {similarProducts.map((item) => (
              <motion.div
                key={item.id}
                className="min-w-[180px] md:min-w-0"
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* MOBILE FLOATING ACTION BAR (The "Biba" Signature Look) */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 md:hidden">
        <div className="flex gap-4">
          <button className="p-4 border border-gray-200 rounded-2xl text-gray-400">
            <Heart size={20} />
          </button>
          <button className="flex-1 bg-[#7B2D0A] text-[#F3E1B6] py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3">
            <ShoppingBag size={18} /> Add To Bag
          </button>
        </div>
      </div>

      {/* BOTTOM REDIRECT CTA (Desktop only) */}
      <div className="hidden md:flex mt-15 flex-col items-center justify-center text-center pb-20">
        <div className="w-24 h-px bg-[#D4AF37]/30 mb-8" />
        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 mb-6">
          Didn't find the perfect fit?
        </p>
        <Link
          href="/products"
          className="group relative px-12 py-6 overflow-hidden bg-transparent border border-[#7B2D0A] text-[#7B2D0A] font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 hover:text-[#F3E1B6]"
        >
          <div className="absolute inset-0 w-0 bg-[#7B2D0A] transition-all duration-500 ease-out group-hover:w-full" />
          <span className="relative z-10 flex items-center gap-4">
            Explore All Products{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-2 transition-transform duration-500"
            />
          </span>
        </Link>
      </div>
    </div>
  );
}

// Helper Component for Accordion Items
function AccordionItem({
  id,
  title,
  icon,
  open,
  onToggle,
  children,
}: AccordionItemProps) {
  return (
    <div className="border-b border-gray-100 last:border-b-0 overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex justify-between items-center py-5 text-left group"
      >
        <div className="flex items-center gap-3 text-[#2A1A12]">
          <span className="text-[#D4AF37]">{icon}</span>
          <span className="text-[11px] md:text-xs font-bold uppercase tracking-widest">
            {title}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <Plus
            size={16}
            className={`${open ? "text-[#7B2D0A]" : "text-gray-300"}`}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="pb-5 px-1"
          >
            <div className="text-sm text-gray-600 leading-relaxed font-serif-not italic">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
