import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchApi } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import Headtext from "./ui/headtext";

const CategoryCard = ({ category, index }) => {
  const isOffers =
    category.name?.toLowerCase().includes("offer") ||
    category.slug === "offers";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="flex flex-col items-center group cursor-pointer"
    >
      {/* Category Card Container */}
      <motion.div
        className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-2 mb-4 w-[140px] h-[140px] flex items-center justify-center shadow-sm hover:shadow-lg border border-gray-200/50 overflow-hidden"
        whileHover={{ y: -4, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-40" />
        <div className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-30" />

        {isOffers ? (
          // Special design for offers
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white drop-shadow-sm"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">%</span>
            </div>
          </div>
        ) : (
          // Product image
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center ">
            <Image
              src={category.image || "/placeholder.jpg"}
              alt={category.name || "Category"}
              width={500}
              height={500}
              className="object-cover rounded-2xl"
            />
          </div>
        )}

        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Category Name */}
      <div className="text-center px-2">
        <h3 className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors duration-300 leading-tight max-w-[120px]">
          {category.name || "Category"}
        </h3>
        {/* Product count */}
        {(category._count?.products || category.count) && (
          <p className="text-xs text-gray-500 mt-1">
            {category._count?.products || category.count} items
          </p>
        )}
      </div>
    </motion.div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="bg-gray-200 rounded-3xl w-[140px] h-[140px] mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-12"></div>
    </div>
  );
};

const CategoriesCarousel = ({ categories }) => {
  const [api, setApi] = useState(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    api.on("select", updateButtons);
    updateButtons();

    return () => api.off("select", updateButtons);
  }, [api]);

  // Check if we need carousel buttons (more than 6 categories on desktop, 3 on mobile)
  const needsCarousel = categories.length > 6;

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories available at the moment</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {categories.map((category, index) => (
            <CarouselItem
              key={category.id || index}
              className="pl-4 basis-auto"
            >
              <Link href={`/category/${category.slug || ""}`} className="block">
                <CategoryCard category={category} index={index} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Conditional Carousel buttons */}
        {needsCarousel && (
          <>
            <CarouselPrevious
              className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                !canScrollPrev ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />
            <CarouselNext
              className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                !canScrollNext ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />
          </>
        )}
      </Carousel>
    </div>
  );
};

const FeaturedCategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await fetchApi("/public/categories");
        setCategories(categoriesRes?.data?.categories || []);
        setCategoriesLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err?.message || "Failed to fetch categories");
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Headtext text="SHOP BY CATEGORY" />

          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Discover our premium collection of fitness supplements and nutrition
            products
          </p>
        </motion.div>

        {categoriesLoading ? (
          <div className="flex justify-center gap-6 overflow-x-auto pb-4">
            {[...Array(6)].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">Failed to load categories</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <CategoriesCarousel categories={categories} />
        )}

        {/* View All Button */}
        {!categoriesLoading && !error && categories.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/categories">
              <motion.button
                className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#1C5282] to-[#1C5282] text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  View All Categories
                  <svg
                    className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategoriesSection;
