import { useState, useEffect } from "react";
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
import Headtext from "./ui/headtext";
import Image from "next/image";

const CircularCategoryCard = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center group"
    >
      {/* Circular Image Container with Rotating Border */}
      <div className="relative mb-6">
        {/* Rotating outline */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#1C4E80]/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Outer circle with position indicator */}
        <div className="p-2 relative">
          {/* Position indicator dot */}
          <motion.div
            className="absolute w-4 h-4 bg-[#F47C20] rounded-full z-20 shadow-md"
            style={{ top: "10%", right: "10%" }}
            whileHover={{ scale: 1.2 }}
          />

          {/* Inner container with image */}
          <motion.div
            className="relative w-48 h-48 md:w-56 md:h-56 overflow-hidden rounded-full cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />

            {/* Image */}
            <Image
              width={800}
              height={800}
              src={category.image || "/c3.jpg"}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Product count badge */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm font-medium z-20">
              {category._count?.products || category.count || 0} PRODUCTS
            </div>

            {/* Hover effect center circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-90 transition-opacity duration-300 shadow-lg"
                initial={{ scale: 0.5 }}
                whileHover={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <svg
                  className="w-6 h-6 text-[#1C4E80]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -z-10 w-12 h-12 bg-[#1C4E80]/10 rounded-full"
          style={{ bottom: "-5%", right: "15%" }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />

        <motion.div
          className="absolute -z-10 w-8 h-8 border-2 border-[#1C4E80]/20 rounded-full"
          style={{ top: "0%", left: "15%" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Category Info */}
      <div className="text-center px-4">
        <h3 className="text-xl font-bold text-[#333333] mb-1">
          {category.name}
        </h3>
        <p className="text-gray-600 text-sm">{category.description || ""}</p>

        {/* Underline animation on hover */}
        <motion.div
          className="h-0.5 w-0 bg-[#F47C20] mx-auto mt-2"
          animate={{ width: "0%" }}
          whileHover={{ width: "30%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gray-200 mb-6"></div>
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
  );
};

const FeaturedCategoriesCarousel = ({ categories }) => {
  const [api, setApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update current slide index when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No categories available at the moment</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category, index) => (
            <CarouselItem
              key={category.id || index}
              className="pl-2 md:pl-4  md:basis-1/3 lg:basis-1/4"
            >
              <Link href={`/category/${category.slug || ""}`} className="block">
                <CircularCategoryCard category={category} index={index} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-2 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-[#1C4E80] hover:text-white" />
        <CarouselNext className="absolute right-2 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-[#1C4E80] hover:text-white" />

        {/* Dot indicators */}
        <div className="flex justify-center mt-8 gap-1.5">
          {Array.from({ length: Math.ceil(categories.length / 4) }).map(
            (_, idx) => (
              <button
                key={idx}
                onClick={() => api?.scrollTo(idx * 4)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / 4) === idx
                    ? "bg-[#F47C20] scale-110"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to slide group ${idx + 1}`}
              />
            )
          )}
        </div>
      </Carousel>
    </div>
  );
};

const FeaturedCategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories from API
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Headtext text="FEATURED CATEGORIES" />
            <p className="text-gray-600 my-6 max-w-2xl mx-auto">
              Discover our collection of premium fitness supplements
            </p>
          </motion.div>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load categories</p>
          </div>
        ) : (
          <FeaturedCategoriesCarousel categories={categories} />
        )}

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="/categories">
            <button className="group relative inline-flex items-center  -mt-20 lg:mt-0 justify-center px-8 py-3 font-medium overflow-hidden">
              <span className="relative z-10 px-3 lg:px-5 py-2 lg:py-3 bg-[#1C4E80] text-nowrap text-white hover:bg-white hover:text-[#1C4E80] border border-[#1C4E80] rounded-full flex items-center">
                VIEW ALL CATEGORIES
                <svg
                  className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#F47C20] group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300"></span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategoriesSection;
