import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Mock categories data (replace with your actual data)
const mockCategories = [
  {
    id: 1,
    name: "Protein",
    description: "Whey, Plant Based & More",
    image: "/c3.jpg",
    count: 24,
  },
  {
    id: 2,
    name: "Pre-Workout",
    description: "Energy & Performance",
    image: "/c3.jpg",
    count: 18,
  },
  {
    id: 3,
    name: "Weight Gain",
    description: "Mass Builders & Gainers",
    image: "/c3.jpg",
    count: 12,
  },
  {
    id: 4,
    name: "Recovery",
    description: "BCAAs & Recovery Aids",
    image: "/c3.jpg",
    count: 16,
  },
];

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
          className="absolute inset-0 rounded-full border-2 border-dashed border-black/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Outer circle with position indicator */}
        <div className="p-2 relative">
          {/* Position indicator dot */}
          <motion.div
            className="absolute w-4 h-4 bg-black rounded-full z-20 shadow-md"
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
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Product count badge */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm font-medium z-20">
              {category.count} PRODUCTS
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
                  className="w-6 h-6"
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
          className="absolute -z-10 w-12 h-12 bg-black/10 rounded-full"
          style={{ bottom: "-5%", right: "15%" }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />

        <motion.div
          className="absolute -z-10 w-8 h-8 border-2 border-black/20 rounded-full"
          style={{ top: "0%", left: "15%" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Category Info */}
      <div className="text-center px-4">
        <h3 className="text-xl font-bold text-black mb-1">{category.name}</h3>
        <p className="text-gray-600 text-sm">{category.description}</p>

        {/* Underline animation on hover */}
        <motion.div
          className="h-0.5 w-0 bg-black mx-auto mt-2"
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

const FeaturedCategories = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {categories.map((category, index) => (
        <CircularCategoryCard
          key={category.id}
          category={category}
          index={index}
        />
      ))}
    </div>
  );
};

const FeaturedCategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call with a timeout
    const timer = setTimeout(() => {
      setCategories(mockCategories);
      setCategoriesLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="relative inline-block">
                FEATURED CATEGORIES
                <motion.div
                  className="absolute -bottom-3 left-0 right-0 mx-auto w-24 h-1 bg-black"
                  initial={{ width: 0 }}
                  whileInView={{ width: "24px" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </span>
            </h2>
            <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
              Discover our collection of premium fitness supplements
            </p>
          </motion.div>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(4)].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load categories</p>
          </div>
        ) : (
          <FeaturedCategories categories={categories} />
        )}

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="/products">
            <button className="group relative inline-flex items-center justify-center px-8 py-3 font-medium overflow-hidden">
              <span className="relative z-10 px-5 py-2 bg-black text-white hover:bg-white hover:text-black border border-black rounded-full flex items-center">
                VIEW ALL CATEGORIES
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
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-black group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300"></span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategoriesSection;
