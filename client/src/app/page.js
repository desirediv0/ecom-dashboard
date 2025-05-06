"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Star,
  ShoppingCart,
  ChevronRight,
  Heart,
  ChevronLeft,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselAutoplayButton,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import GymSupplementShowcase from "@/components/showcase";
import BenefitsSec from "@/components/benifit-sec";
import FeaturedCategoriesSection from "@/components/catgry";

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

// Featured Categories Component with circular cards and better UI
const FeaturedCategories = ({ categories = [] }) => {
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
              className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link href={`/category/${category.slug || ""}`} className="block">
                <div className="relative group flex flex-col items-center">
                  {/* Circular image container */}
                  <div className="w-48 h-48 max-w-full mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 mb-4">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name || "Category"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(
                          category.name || "Category"
                        )}`}
                      />
                    )}
                  </div>

                  {/* Category name and product count */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-1 text-gray-800 group-hover:text-primary transition-colors">
                      {category.name || "Category"}
                    </h3>
                    <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                      {category._count?.products || 0} Products
                    </span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-2 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white" />
        <CarouselNext className="absolute right-2 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white" />

        {/* Dot indicators */}
        <div className="flex justify-center mt-8 gap-1.5">
          {Array.from({ length: Math.ceil(categories.length / 4) }).map(
            (_, idx) => (
              <button
                key={idx}
                onClick={() => api?.scrollTo(idx * 4)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / 4) === idx
                    ? "bg-primary scale-110"
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

// Featured Products Component with modern card design
const FeaturedProducts = ({ products = [] }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="relative inline-block">
                FEATURED PRODUCTS
                <motion.span
                  className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 -z-10"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              High-quality supplements to enhance your fitness journey
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id || product.slug || Math.random().toString()}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative p-6 bg-gray-50/50">
                {/* Circular image with aspect ratio preserved */}
                <Link
                  href={`/products/${product.slug || ""}`}
                  className="block relative aspect-square mx-auto max-w-[180px]"
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name || "Product"}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 rounded-full ${getProductColor(
                        product.name || "Product"
                      )} flex items-center justify-center`}
                    >
                      <span className="font-medium text-gray-500 text-xl">
                        {(product.name || "XX").substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Labels and action buttons */}
                {product.hasSale && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
                    SALE
                  </span>
                )}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    aria-label="Add to wishlist"
                    className="bg-white rounded-full p-2 shadow-md transition-transform hover:scale-110 hover:bg-primary hover:text-white"
                  >
                    <Heart className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    aria-label="Quick shop"
                    className="bg-white rounded-full p-2 shadow-md transition-transform hover:scale-110 hover:bg-primary hover:text-white"
                  >
                    <ShoppingCart className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-1.5">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5"
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

                <Link href={`/products/${product.slug || ""}`}>
                  <h3 className="text-base md:text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {product.name || "Product"}
                  </h3>
                </Link>

                <div className="flex flex-wrap items-center justify-between mt-3">
                  <div>
                    {product.hasSale ? (
                      <div className="flex items-center">
                        <span className="font-bold text-base md:text-lg">
                          ₹{product.basePrice || 0}
                        </span>
                        <span className="text-gray-500 line-through text-xs ml-2">
                          ₹{product.regularPrice || 0}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-base md:text-lg">
                        ₹{product.basePrice || 0}
                      </span>
                    )}
                  </div>

                  {(product.flavors || 0) > 1 && (
                    <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                      {product.flavors} flavors
                    </span>
                  )}
                </div>

                <Link href={`/products/${product.slug || ""}`}>
                  <Button
                    size="sm"
                    className="w-full mt-4 py-2 rounded-full font-medium group-hover:bg-primary/90 transition-colors"
                  >
                    Add to Cart
                  </Button>
                </Link>
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
      </div>
    </section>
  );
};

// Benefits Section with modern cards
// const BenefitsSection = () => {
//   const benefits = [
//     {
//       title: "Premium Quality",
//       description:
//         "Lab-tested supplements made with high-quality ingredients for maximum effectiveness.",
//       icon: "🏆",
//     },
//     {
//       title: "Fast Delivery",
//       description:
//         "Get your supplements delivered to your doorstep within 2-3 business days.",
//       icon: "🚚",
//     },
//     {
//       title: "Expert Support",
//       description:
//         "Our team of fitness experts is available to help you choose the right supplements.",
//       icon: "👨‍⚕️",
//     },
//     {
//       title: "Secure Payments",
//       description: "Shop with confidence with our 100% secure payment gateway.",
//       icon: "🔒",
//     },
//   ];

//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold relative inline-block">
//             <span className="relative z-10 uppercase">Why Choose Us</span>
//             <span className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 z-0"></span>
//           </h2>
//           <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
//             We're committed to providing you with the best fitness supplements
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {benefits.map((benefit, index) => (
//             <div
//               key={index}
//               className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
//             >
//               <div className="text-4xl mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
//                 {benefit.icon}
//               </div>
//               <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
//               <p className="text-gray-600">{benefit.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
<BenefitsSec />

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ravi Sharma",
      role: "Fitness Enthusiast",
      avatar: "RS",
      quote:
        "I've tried many supplements, but EcomSupplements products have truly made a difference in my training and recovery.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Yoga Instructor",
      avatar: "PP",
      quote:
        "The quality of these supplements is exceptional. I recommend them to all my clients looking for clean nutrition.",
      rating: 5,
    },
    {
      name: "Arjun Singh",
      role: "Bodybuilder",
      avatar: "AS",
      quote:
        "These supplements have been a game-changer for my competition prep. Pure ingredients and great results!",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold relative inline-block">
            <span className="relative z-10 uppercase">
              What Our Customers Say
            </span>
            <span className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 z-0"></span>
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Real experiences from people who trust our products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden relative bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    fill={i < testimonial.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="text-gray-700 italic">
                &quot;{testimonial.quote}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Trending Products Section with horizontal scroll on mobile
const TrendingSection = ({ products = [] }) => {
  const [api, setApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayProducts = products.slice(0, 8);

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
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="relative inline-block">
                TRENDING NOW
                <motion.span
                  className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 -z-10"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Our most popular supplements that customers love
            </p>
          </motion.div>
        </div>

        <div className="relative">
          <Carousel setApi={setApi} opts={{ loop: true, align: "start" }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {displayProducts.map((product) => (
                <CarouselItem
                  key={product.id || product.slug || Math.random().toString()}
                  className="pl-2 md:pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="p-6 bg-gray-50/50 relative">
                      <Link
                        href={`/products/${product.slug || ""}`}
                        className="block relative aspect-square mx-auto max-w-[160px]"
                      >
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name || "Product"}
                            fill
                            className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        ) : (
                          <div
                            className={`absolute inset-0 rounded-full ${getProductColor(
                              product.name || "Product"
                            )} flex items-center justify-center`}
                          >
                            <span className="font-medium text-gray-500 text-xl">
                              {(product.name || "XX")
                                .substring(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                      </Link>

                      {product.hasSale && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
                          SALE
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <Link href={`/products/${product.slug || ""}`}>
                        <h3 className="text-base font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name || "Product"}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base">
                          ₹{product.basePrice || 0}
                        </span>
                        <Link href={`/products/${product.slug || ""}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="px-3 py-1 text-xs rounded-full"
                          >
                            Quick View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-2 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white" />
            <CarouselNext className="absolute right-2 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white" />

            {/* Dot indicators */}
            <div className="flex justify-center mt-8 gap-1.5">
              {Array.from({
                length: Math.ceil(displayProducts.length / 4),
              }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx * 4)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / 4) === idx
                      ? "bg-primary scale-110"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide group ${idx + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

// Newsletter Section
const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 relative inline-block">
            <span className="relative z-10 uppercase">
              Join Our Fitness Community
            </span>
            <span className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 z-0"></span>
          </h2>
          <p className="text-gray-600 mb-6">
            Subscribe to get exclusive deals, fitness tips, and new product
            alerts.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Product and Category skeletons
const CategorySkeleton = () => (
  <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-200 animate-pulse"></div>
);

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
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch featured products and categories
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetchApi("/public/categories");
        setCategories(categoriesRes?.data?.categories || []);
        setCategoriesLoading(false);

        // Fetch products
        const productsRes = await fetchApi(
          "/public/products?featured=true&limit=8"
        );
        setFeaturedProducts(productsRes?.data?.products || []);
        setProductsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err?.message || "Failed to fetch data");
        setProductsLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <HeroCarousel />
      <AnnouncementBanner />

      {/* Featured Categories section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="relative inline-block">
                  FEATURED CATEGORIES
                  <motion.span
                    className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 -z-10"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  />
                </span>
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                Discover our collection of premium fitness supplements
              </p>
            </motion.div>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center animate-pulse"
                >
                  <div className="w-48 h-48 rounded-full bg-gray-200 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load categories</p>
            </div>
          ) : (
            <FeaturedCategories categories={categories} />
          )}

          <div className="text-center mt-10">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="font-medium border-primary text-primary hover:bg-primary hover:text-white group"
              >
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - show skeleton if loading */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold relative inline-block">
              <span className="relative z-10 uppercase">Featured Products</span>
              <span className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 z-0"></span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              High-quality supplements to enhance your fitness journey
            </p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load products</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <FeaturedProducts products={featuredProducts} />
          )}
        </div>
      </section>
     

      {/* Trending Products Section */}
      {!productsLoading && !error && featuredProducts.length > 0 && (
        <TrendingSection products={featuredProducts} />
      )}
       <GymSupplementShowcase />

<BenefitsSec />
      {/* <BenefitsSection /> */}
   <TestimonialsSection />
      
      <FeaturedCategoriesSection />
      
      <NewsletterSection />
    </div>
  );
}
