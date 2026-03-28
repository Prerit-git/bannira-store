"use client"

import Categories from "@/components/Categories";
import HeroSection from "@/components/Hero";
import PageBreakerSlider from "@/components/PageBreakerSlider";
import ProductsSection from "@/components/ProductsSection";
import ShowcaseSection from "@/components/ShowcaseSection";

export default function Home() {
  return (
    <>
    <HeroSection/>
    <Categories/>
    <ProductsSection/>
    <PageBreakerSlider/>
    <ShowcaseSection/>
    </>
  );
}
