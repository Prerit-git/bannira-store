"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Filter, ArrowDownUp, X, Check } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortOption, setSortOption] = useState<string>("latest");

  // Mobile Drawer States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // DISABLE SCROLL WHEN DRAWER IS OPEN
  useEffect(() => {
    if (isFilterOpen || isSortOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterOpen, isSortOpen]);

  // Dynamic Filter Values
  const categories = [...new Set(products.map((p) => p.category))];
  const sizes = [...new Set(products.flatMap((p) => p.sizes))];
  const colors = [...new Set(products.map((p) => p.color))];

  const priceOptions = [
    { label: "Under ₹1000", min: 0, max: 1000 },
    { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
    { label: "₹2000 - ₹3000", min: 2000, max: 3000 },
    { label: "Above ₹3000", min: 3000, max: 100000 }, // High number for 'Above'
  ];

  const toggleFilter = <T extends string | number>(
    value: T,
    selected: T[],
    setSelected: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    setSelected((prev) =>
      prev.includes(value as any)
        ? prev.filter((v) => v !== value)
        : [...prev, value as any],
    );
  };

  const resetFilters = () => {
    setSelectedCategory([]);
    setSelectedSize([]);
    setSelectedColor([]);
    setPriceRange({ min: 0, max: 100000 });
  };

  const activeFiltersCount =
    selectedCategory.length +
    selectedSize.length +
    selectedColor.length +
    (priceRange.min > 0 || priceRange.max < 100000 ? 1 : 0);

  // Filter & Sort Logic
  let filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory.length === 0 ||
      selectedCategory.includes(product.category);
    const sizeMatch =
      selectedSize.length === 0 ||
      product.sizes.some((s) => selectedSize.includes(s));
    const colorMatch =
      selectedColor.length === 0 || selectedColor.includes(product.color);

    // FIXED PRICE LOGIC
    const priceMatch =
      product.price >= priceRange.min && product.price <= priceRange.max;

    return categoryMatch && sizeMatch && colorMatch && priceMatch;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "low-to-high") return a.price - b.price;
    if (sortOption === "high-to-low") return b.price - a.price;
    return 0;
  });

  // ANIMATION VARIANTS
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const drawerVariants: Variants = {
    hidden: {
      y: "100%",
      transition: {
        type: "tween",
        duration: 0.4,
        ease: [0.32, 0.72, 0, 1],
      },
    },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        mass: 0.8,
      },
    },
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen pt-35 md:pt-40 pb-24 md:pb-16 overflow-x-hidden">
        <div className="max-w-400 mx-auto px-6 mb-6">
      <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
        <a 
          href="/" 
          className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 group"
        >
          <span className="group-hover:translate-x-0.5 transition-transform">Home</span>
        </a>
        
        {/* Elegant Separator */}
        <div className="w-1 h-1 rounded-full bg-gray-300" />
        
        <span className="text-[#D4AF37]">Shop</span>
        
        <div className="w-1 h-1 rounded-full bg-gray-300" />
        
        <span className="text-[#2A1A12] opacity-60">All Products</span>
      </nav>
    </div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 px-6 max-w-400 mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2A1A12] font-serif tracking-tight">
          Collection{" "}
          <span className="text-xs uppercase tracking-widest font-sans font-normal text-gray-400 block md:inline md:ml-2">
            ({filteredProducts.length} items)
          </span>
        </h1>

        {/* Desktop Sort */}
        <div className="hidden md:flex gap-2">
          {["latest", "low-to-high", "high-to-low"].map((opt) => (
            <button
              key={opt}
              onClick={() => setSortOption(opt)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                sortOption === opt
                  ? "bg-[#D4AF37] text-white shadow-lg shadow-gold/20"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {opt.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-400 mx-auto px-4 md:px-6 flex gap-10">
        {/* DESKTOP SIDEBAR */}
        <aside className="w-72 hidden md:block sticky h-fit space-y-8">
          <button
            onClick={resetFilters}
            className="w-full py-3 rounded-xl bg-[#2A1A12] text-[#D4AF37] text-sm font-bold uppercase tracking-relaxed hover:bg-black transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>

          <FilterSection
            title="Categories"
            items={categories}
            selected={selectedCategory}
            onToggle={(v: any) =>
              toggleFilter(v, selectedCategory, setSelectedCategory)
            }
          />

          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#2A1A12]">
              Price Range
            </p>
            {priceOptions.map((p) => (
              <button
                key={p.label}
                onClick={() => setPriceRange({ min: p.min, max: p.max })}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  priceRange.min === p.min && priceRange.max === p.max
                    ? "border-[#D4AF37] bg-[#FDFBF0] text-[#7B2D0A] font-bold"
                    : "border-gray-100 bg-white hover:border-gray-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <FilterSection
            title="Available Sizes"
            items={sizes}
            selected={selectedSize}
            onToggle={(v: any) =>
              toggleFilter(v, selectedSize, setSelectedSize)
            }
          />

          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#2A1A12]">
              Color Palette
            </p>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <ColorCircle
                  key={color}
                  color={color}
                  isSelected={selectedColor.includes(color)}
                  onClick={() =>
                    toggleFilter(color, selectedColor, setSelectedColor)
                  }
                />
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <section className="flex-1">
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-dashed border-gray-200"
            >
              <div className="w-20 h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-6">
                <Filter size={32} className="text-[#D4AF37] opacity-50" />
              </div>
              <h3 className="text-xl font-serif text-[#2A1A12] mb-2">
                No items found
              </h3>
              <p className="text-gray-500 text-sm max-w-xs mb-8">
                We couldn't find any products matching your current selection.
                Try adjusting your filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-8 py-3 bg-[#D4AF37] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-gold/20"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>

      {/* MOBILE CTA BAR */}
      {/* MOBILE CTA BAR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[85%] md:hidden flex bg-[#2A1A12] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-white font-bold text-xs uppercase tracking-widest border-r border-white/5 relative active:bg-white/10 transition"
        >
          <div className="relative">
            <Filter size={16} className="text-[#D4AF37]" />
            {/* BADGE */}
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#2A1A12] text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#2A1A12]"
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          Filter
        </button>
        <button
          onClick={() => setIsSortOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-white font-bold text-xs uppercase tracking-widest active:bg-white/10 transition"
        >
          <ArrowDownUp size={16} className="text-[#D4AF37]" /> Sort
        </button>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-md"
            />
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-x-0 bottom-0 z-[51] bg-[#FAF9F6] rounded-t-[2.5rem] max-h-[92vh] flex flex-col shadow-2xl"
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-4 mb-2" />
              <div className="px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#2A1A12] font-serif">
                    Filters
                  </h2>
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#F3E1B6] text-[#7B2D0A] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter">
                      {activeFiltersCount} Active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 pb-32 space-y-10">
                <MobileFilterGroup title="Categories">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          toggleFilter(
                            cat,
                            selectedCategory,
                            setSelectedCategory,
                          )
                        }
                        className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${selectedCategory.includes(cat) ? "bg-[#D4AF37] border-[#D4AF37] text-white" : "bg-white border-gray-200"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </MobileFilterGroup>

                <MobileFilterGroup title="Price Range">
                  <div className="grid grid-cols-1 gap-2">
                    {priceOptions.map((p) => (
                      <button
                        key={p.label}
                        onClick={() =>
                          setPriceRange({ min: p.min, max: p.max })
                        }
                        className={`w-full py-4 px-6 rounded-2xl border text-left flex justify-between items-center ${
                          priceRange.min === p.min && priceRange.max === p.max
                            ? "bg-white border-[#D4AF37] ring-1 ring-[#D4AF37]"
                            : "bg-white border-gray-100"
                        }`}
                      >
                        <span
                          className={
                            priceRange.min === p.min && priceRange.max === p.max
                              ? "font-bold text-[#7B2D0A]"
                              : ""
                          }
                        >
                          {p.label}
                        </span>
                        {priceRange.min === p.min &&
                          priceRange.max === p.max && (
                            <Check size={18} className="text-[#D4AF37]" />
                          )}
                      </button>
                    ))}
                  </div>
                </MobileFilterGroup>

                <MobileFilterGroup title="Colors">
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="flex flex-col items-center gap-2"
                      >
                        <ColorCircle
                          color={color}
                          isSelected={selectedColor.includes(color)}
                          onClick={() =>
                            toggleFilter(color, selectedColor, setSelectedColor)
                          }
                        />
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </MobileFilterGroup>

                <MobileFilterGroup title="Sizes">
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          toggleFilter(size, selectedSize, setSelectedSize)
                        }
                        className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-bold transition-all ${selectedSize.includes(size) ? "bg-black text-white border-black" : "bg-white border-gray-200"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </MobileFilterGroup>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-8 bg-white/80 backdrop-blur-lg border-t border-gray-100 flex gap-4">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-gray-400"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-[2] py-4 bg-[#D4AF37] text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-gold/20"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE SORT DRAWER */}
      <AnimatePresence>
        {isSortOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsSortOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-md"
            />
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-x-0 bottom-0 z-[51] bg-[#FAF9F6] rounded-t-[2.5rem] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-[#2A1A12] font-serif mb-6">
                Sort By
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Latest Arrivals", value: "latest" },
                  { label: "Price: Low to High", value: "low-to-high" },
                  { label: "Price: High to Low", value: "high-to-low" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full p-5 rounded-2xl flex justify-between items-center transition-all ${sortOption === option.value ? "bg-[#FDFBF0] text-[#7B2D0A] border border-[#D4AF37]" : "bg-white border border-gray-100"}`}
                  >
                    <span className="font-bold text-sm uppercase tracking-wide">
                      {option.label}
                    </span>
                    {sortOption === option.value && (
                      <Check size={20} className="text-[#D4AF37]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// HELPER COMPONENTS
function ColorCircle({
  color,
  isSelected,
  onClick,
}: {
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const colorCode = products.find((p) => p.color === color)?.colorCode || color;
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-full border-2 transition-transform active:scale-90 flex items-center justify-center ${isSelected ? "ring-2 ring-[#D4AF37] ring-offset-2 border-transparent" : "border-gray-200"}`}
      style={{ backgroundColor: colorCode }}
    >
      {isSelected && (
        <Check
          size={16}
          className={
            color.toLowerCase() === "white" ? "text-black" : "text-white"
          }
        />
      )}
    </button>
  );
}

function MobileFilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function FilterSection({ title, items, selected, onToggle }: any) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-bold uppercase tracking-widest text-[#2A1A12]">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item: string) => (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`px-4 py-2 border rounded-full text-xs font-bold transition-all ${selected.includes(item) ? "bg-[#D4AF37] border-[#D4AF37] text-white" : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
