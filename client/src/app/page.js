"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronRight, Heart, Eye } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import GymSupplementShowcase from "@/components/showcase";
import BenefitsSec from "@/components/benifit-sec";
import FeaturedCategoriesSection from "@/components/catgry";
import Headtext from "@/components/ui/headtext";
import ProductQuickView from "@/components/ProductQuickView";

// Hero Carousel Component
const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);
  const [autoplay, setAutoplay] = useState(true);

  const slides = [
    {
      title: "PREMIUM SUPPLEMENTS",
      subtitle: "Fuel your workouts with high-quality ingredients",
      cta: "SHOP NOW",
      ctaLink: "/products",
    },
    {
      title: "ADVANCED PROTEIN FORMULA",
      subtitle: "30g protein per serving with zero added sugar",
      cta: "EXPLORE",
      ctaLink: "/category/protein",
    },
    {
      title: "SUPERCHARGE YOUR WORKOUT",
      subtitle: "Pre-workout supplements that deliver real results",
      cta: "SHOP PRE-WORKOUT",
      ctaLink: "/category/pre-workout",
    },
  ];

  // Handle autoplay functionality
  useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, autoplay]);

  // Update current slide index when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="relative overflow-hidden h-[500px] md:h-[600px]">
      {/* Single background video that stays consistent across all slides */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      <Carousel setApi={setApi} className="h-full relative z-20">
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full p-0">
              <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
                {/* Content */}
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-32 lg:mt-48 text-white mb-4 uppercase tracking-wider">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-8">
                      {slide.subtitle}
                    </p>
                    <Link href={slide.ctaLink}>
                      <Button
                        size="lg"
                        className="text-lg px-4 lg:px-12 py-6 font-bold"
                      >
                        {slide.cta}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <CarouselPrevious
          className="left-8 h-10 w-10 z-30 opacity-70 hover:opacity-100"
          variant="secondary"
        />
        <CarouselNext
          className="right-8 h-10 w-10 z-30 opacity-70 hover:opacity-100"
          variant="secondary"
        />

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Autoplay Toggle */}
        <div className="absolute bottom-6 right-6 z-30">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 bg-white/20 hover:bg-white/30"
            onClick={() => setAutoplay(!autoplay)}
            aria-label={autoplay ? "Pause slideshow" : "Play slideshow"}
          >
            {autoplay ? (
              <span className="block w-3 h-3 bg-current"></span>
            ) : (
              <span className="block w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-current ml-0.5"></span>
            )}
          </Button>
        </div>
      </Carousel>
    </div>
  );
};

// Announcement Banner
const AnnouncementBanner = () => {
  return (
    <div className="bg-primary/10 py-4 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-center">
          <div className="flex items-center">
            <span className="text-sm md:text-base font-medium">
              ⚡ FREE SHIPPING ON ORDERS ABOVE ₹999
            </span>
          </div>
          <div className="hidden md:flex items-center">
            <span className="text-sm md:text-base font-medium">
              🎁 GET A FREE SHAKER WITH PROTEIN PURCHASES
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm md:text-base font-medium">
              🔥 USE CODE <strong>FIT10</strong> FOR 10% OFF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility functions for colors
// Function to get a consistent color based on category name
const getCategoryColor = (name) => {
  const colors = [
    "from-blue-700 to-blue-500",
    "from-purple-700 to-purple-500",
    "from-red-700 to-red-500",
    "from-green-700 to-green-500",
    "from-yellow-700 to-yellow-500",
    "from-indigo-700 to-indigo-500",
    "from-pink-700 to-pink-500",
    "from-teal-700 to-teal-500",
  ];

  // Simple hash function to get consistent color for same category name
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

// Function to get a consistent color based on product name
const getProductColor = (name) => {
  const colors = [
    "bg-blue-100",
    "bg-purple-100",
    "bg-red-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-indigo-100",
    "bg-pink-100",
    "bg-teal-100",
  ];

  // Simple hash function to get consistent color for same product name
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

// This returns a gradient background for categories without images
const getCategoryGradient = (name) => {
  const gradients = {
    Protein: "from-orange-400 to-amber-600",
    "Pre-Workout": "from-purple-500 to-indigo-600",
    "Weight Loss": "from-green-400 to-teal-500",
    Vitamins: "from-blue-400 to-cyan-500",
    Performance: "from-red-400 to-rose-600",
    Wellness: "from-pink-400 to-fuchsia-600",
    Accessories: "from-gray-400 to-slate-600",
  };

  return gradients[name] || "from-primary/60 to-primary";
};

// Calculate number of items to show based on screen size
function useWindowSize() {
  const [size, setSize] = useState(4);

  useEffect(() => {
    function updateSize() {
      if (window.innerWidth < 640) {
        setSize(1);
      } else if (window.innerWidth < 768) {
        setSize(2);
      } else if (window.innerWidth < 1024) {
        setSize(3);
      } else {
        setSize(4);
      }
    }

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

// Featured Products Component with modern card design
const FeaturedProducts = ({
  products = [],
  isLoading = false,
  error = null,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load products</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <div
            key={product.id || product.slug || Math.random().toString()}
            className="bg-white overflow-hidden transition-all hover:shadow-lg shadow-md rounded-sm group"
          >
            <Link href={`/products/${product.slug || ""}`}>
              <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name || "Product"}
                    fill
                    className="object-contain p-4 transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <Image
                    src="/product-placeholder.jpg"
                    alt={product.name || "Product"}
                    fill
                    className="object-contain p-4 transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                {product.hasSale && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                    SALE
                  </span>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 backdrop-blur-[2px] flex justify-center py-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-primary/80 rounded-full p-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuickViewProduct(product);
                      setQuickViewOpen(true);
                    }}
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-primary/80 rounded-full p-2 mx-2"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Link>

            <div className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      fill={
                        i < Math.round(product.avgRating || 0)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  ({product.reviewCount || 0})
                </span>
              </div>

              <Link
                href={`/products/${product.slug || ""}`}
                className="hover:text-primary"
              >
                <h3 className="font-medium uppercase mb-2 line-clamp-2 text-sm">
                  {product.name || "Product"}
                </h3>
              </Link>

              <div className="flex items-center justify-center mb-2">
                {product.hasSale ? (
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-primary">
                      ₹{product.basePrice || 0}
                    </span>
                    <span className="text-gray-500 line-through text-sm ml-2">
                      ₹{product.regularPrice || 0}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-lg text-primary">
                    ₹{product.basePrice || 0}
                  </span>
                )}
              </div>

              {(product.flavors || 0) > 1 && (
                <span className="text-xs text-gray-500 block">
                  {product.flavors} variants
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/products">
          <Button
            variant="outline"
            size="lg"
            className="font-medium border-primary text-primary hover:bg-primary hover:text-white group rounded-full"
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </div>

      {/* Quick View Dialog */}
      <ProductQuickView
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ravi Sharma",
      role: "Fitness Enthusiast",
      avatar: "/avatar1.jpg",
      quote:
        "I've tried many supplements, but these products have truly made a difference in my training and recovery.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Yoga Instructor",
      avatar: "/avatar2.jpg",
      quote:
        "The quality of these supplements is exceptional. I recommend them to all my clients looking for clean nutrition.",
      rating: 5,
    },
    {
      name: "Arjun Singh",
      role: "Bodybuilder",
      avatar: "/avatar3.jpg",
      quote:
        "These supplements have been a game-changer for my competition prep. Pure ingredients and great results!",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-y-0 left-0 w-1/6 bg-primary/10"></div>
        <div className="absolute inset-y-0 right-0 w-1/6 bg-primary/10"></div>
        <div className="absolute inset-x-0 top-0 h-1/6 bg-primary/10"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/6 bg-primary/10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Headtext text="WHAT OUR CUSTOMERS SAY" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Real experiences from people who trust our products
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Decorative quotes */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-lg p-6 transition-all"
              >
                {/* Top border highlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-16 bg-primary rounded-full"></div>

                {/* Testimonial content */}
                <div className="pt-6">
                  {/* Avatar and info */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-white shadow-md">
                      {testimonial.avatar && (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
                          {testimonial.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 italic">
                    &quot;{testimonial.quote}&quot;
                  </p>

                  {/* Bottom design element */}
                  <div className="mt-6 flex justify-center">
                    <motion.div
                      className="h-1 w-12 bg-primary/30 rounded-full"
                      whileHover={{ width: 60 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Newsletter Section
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log(`Subscribed with: ${email}`);
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail("");
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-black/90 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1500"
          alt="Fitness background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20 shadow-xl">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              {/* Left content */}
              <div className="w-full md:w-1/2 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  JOIN OUR <span className="text-gray-400">FITNESS</span>{" "}
                  COMMUNITY
                </h2>

                <p className="text-gray-300 mb-6">
                  Get exclusive workout tips, nutrition advice, and special
                  offers straight to your inbox.
                </p>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                      <div className="h-6 w-6 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm">Weekly fitness newsletter</span>
                  </div>

                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 7h-9"></path>
                        <path d="M14 17H5"></path>
                        <circle cx="17" cy="17" r="3"></circle>
                        <circle cx="7" cy="7" r="3"></circle>
                      </svg>
                    </div>
                    <span className="text-sm">Personalized workout plans</span>
                  </div>

                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                      </svg>
                    </div>
                    <span className="text-sm">
                      Exclusive discounts & offers
                    </span>
                  </div>
                </div>
              </div>

              {/* Right form */}
              <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-lg">
                {subscribed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-10"
                  >
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Thank You for Subscribing!
                    </h3>
                    <p className="text-gray-600">
                      Check your inbox for a welcome message and a special
                      discount code.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Subscribe to Our Newsletter
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Your Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        >
                          Subscribe Now
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                          </svg>
                        </motion.button>
                      </div>

                      <p className="text-xs text-gray-500 text-center mt-4">
                        By subscribing, you agree to our Privacy Policy and
                        consent to receive updates from our company.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

// Home page component
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch featured products
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetchApi(
          "/public/products?featured=true&limit=8"
        );
        setFeaturedProducts(productsRes?.data?.products || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err?.message || "Failed to fetch data");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <HeroCarousel />
      <AnnouncementBanner />

      {/* Featured Categories Section */}
      <FeaturedCategoriesSection />

      {/* Featured Products Section */}
      {featuredProducts.length && (
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Headtext text="FEATURED PRODUCTS" />
              <p className="text-gray-600 my-6 max-w-2xl mx-auto">
                High-quality supplements to enhance your fitness journey
              </p>
            </div>

            <FeaturedProducts
              products={featuredProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}

      <GymSupplementShowcase />
      <BenefitsSec />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
