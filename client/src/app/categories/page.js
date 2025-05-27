"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

// Category card component
const CategoryCard = ({ category }) => {
  // Function to get image URL
  const getImageUrl = (image) => {
    if (!image) return "/images/product-placeholder.jpg";
    if (image.startsWith("http")) return image;
    return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
    >
      <Link href={`/category/${category.slug}`}>
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={
              category.Image
                ? getImageUrl(category.image)
                : "/banner-background.jpg"
            }
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
          <p className="text-gray-600 text-sm flex-grow">
            {category.description || "Explore our products in this category"}
          </p>
          <div className="mt-4 text-primary font-medium text-sm">
            View Products →
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Category skeleton loader for loading state
const CategoryCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-gray-200"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetchApi("/public/categories");
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">All Categories</h1>
        <div className="flex items-center">
          <Link href="/" className="text-gray-500 hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Categories</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6 flex">
          <AlertCircle className="text-red-500 mr-3" />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">No categories found</h2>
          <p className="text-gray-600 mb-6">
            Please check back later for categories.
          </p>
          <Link href="/products">
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              Browse All Products
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
