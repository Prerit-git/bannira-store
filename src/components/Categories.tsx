const categories = [
  {
    title: "Ethnic Wear",
    subtitle: "Timeless Traditions",
    description: "Sarees, Lehengas & Suits",
    image: "/assets/cat-ethnic.jpg",
    span: "large",
  },
  {
    title: "Western Wear",
    subtitle: "Contemporary Charm",
    description: "Indo-Western & Fusion",
    image: "/assets/cat-western.jpg",
    span: "small",
  },
  {
    title: "New Arrivals",
    subtitle: "Just Dropped",
    description: "Latest Season Collection",
    image: "/assets/cat-new-arrivals.jpg",
    span: "small",
  },
  {
    title: "Festive Collection",
    subtitle: "Celebrate in Style",
    description: "Diwali, Navratri & More",
    image: "/assets/cat-festive.jpg",
    span: "large",
  },
];

const PremiumCategories = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-[#D4AF37] mb-3">
            ✦ &nbsp; Explore Our World &nbsp; ✦
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#7B2D0A] mb-4">
            Premium Categories
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="block w-16 h-px bg-[#D4AF37]" />
            <span className="block w-2 h-2 rotate-45 border border-[#D4AF37]" />
            <span className="block w-16 h-px bg-[#D4AF37]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          <a
            href="#"
            className="group relative overflow-hidden lg:col-span-2 aspect-[16/9] md:aspect-[16/8]"
          >
            <img
              src={categories[0].image}
              alt={categories[0].title}
              loading="lazy"
              width={640}
              height={800}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#7B2D0A]/90 via-[#7B2D0A]/30 to-transparent" />
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#ffffff]/50" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#ffffff]/50" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#F8F3EF] mb-1">
                {categories[0].subtitle}
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-[#F8F3EF] mb-1">
                {categories[0].title}
              </h3>
              <p className="font-body text-sm text-[#F8F3EF]/60">
                {categories[0].description}
              </p>
              <div className="w-10 h-0.5 bg-gold mt-4 group-hover:w-20 transition-all duration-500" />
            </div>
          </a>

          <a
            href="#"
            className="group relative overflow-hidden aspect-[3/4] md:aspect-auto"
          >
            <img
              src={categories[1].image}
              alt={categories[1].title}
              loading="lazy"
              width={640}
              height={800}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#7B2D0A]/90 via-[#7B2D0A]/20 to-transparent" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#ffffff]" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#F8F3EF] mb-1">
                {categories[1].subtitle}
              </p>
              <h3 className="font-display text-xl md:text-2xl font-bold text-[#F8F3EF] mb-1">
                {categories[1].title}
              </h3>
              <p className="font-body text-sm text-[#F8F3EF]/60">
                {categories[1].description}
              </p>
              <div className="w-8 h-0.5 bg-gold mt-3 group-hover:w-16 transition-all duration-500" />
            </div>
          </a>

          <a
            href="#"
            className="group relative overflow-hidden aspect-[3/4] md:aspect-auto"
          >
            <img
              src={categories[2].image}
              alt={categories[2].title}
              loading="lazy"
              width={640}
              height={800}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#7B2D0A]/90 via-[#7B2D0A]/20 to-transparent" />
            {/* "NEW" badge */}
            <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#7B2D0A] font-body text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1">
              New
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#F8F3EF] mb-1">
                {categories[2].subtitle}
              </p>
              <h3 className="font-display text-xl md:text-2xl font-bold text-[#F8F3EF] mb-1">
                {categories[2].title}
              </h3>
              <p className="font-body text-sm text-[#F8F3EF]/60">
                {categories[2].description}
              </p>
              <div className="w-8 h-0.5 bg-gold mt-3 group-hover:w-16 transition-all duration-500" />
            </div>
          </a>

          <a
            href="#"
            className="group relative overflow-hidden lg:col-span-2 aspect-[16/9] md:aspect-[16/8]"
          >
            <img
              src={categories[3].image}
              alt={categories[3].title}
              loading="lazy"
              width={640}
              height={800}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#7B2D0A]/90 via-[#7B2D0A]/30 to-transparent" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#ffffff]/50" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#ffffff]/50" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#F8F3EF] mb-1">
                {categories[3].subtitle}
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-[#F8F3EF] mb-1">
                {categories[3].title}
              </h3>
              <p className="font-body text-sm text-[#F8F3EF]/60">
                {categories[3].description}
              </p>
              <div className="w-10 h-0.5 bg-gold mt-4 group-hover:w-20 transition-all duration-500" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PremiumCategories;
