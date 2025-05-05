"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Star,
  TrendingUp,
  ShoppingCart,
  ChevronRight,
  Heart,
} from "lucide-react";

// Hero Carousel Component
const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "/hero-supplements.jpg",
      bgColor: "from-blue-900 to-indigo-800",
      title: "Premium Supplements for Your Fitness Journey",
      subtitle: "Fuel your workouts with high-quality ingredients",
      cta: "Shop Now",
      ctaLink: "/products",
    },
    {
      image: "/protein-banner.jpg",
      bgColor: "from-purple-900 to-fuchsia-800",
      title: "NEW: Advanced Protein Formula",
      subtitle: "30g protein per serving with zero added sugar",
      cta: "Explore",
      ctaLink: "/category/protein",
    },
    {
      image: "/pre-workout-banner.jpg",
      bgColor: "from-red-900 to-orange-800",
      title: "Supercharge Your Workout",
      subtitle: "Pre-workout supplements that deliver real results",
      cta: "Shop Pre-Workout",
      ctaLink: "/category/pre-workout",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden h-[500px] md:h-[600px]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
          <div
            className={`relative h-full w-full bg-gradient-to-r ${slide.bgColor}`}
          >
            {/* Try to load image, fallback to gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-8">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.ctaLink}>
                    <Button size="lg" className="text-lg px-8 py-6">
                      {slide.cta}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
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

// Featured Categories Component with hover animation
const FeaturedCategories = ({ categories }) => {
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold relative">
            <span className="relative z-10">Featured Categories</span>
            <span className="absolute bottom-0 left-0 h-3 w-1/2 bg-primary/20 z-0"></span>
          </h2>
          <Link
            href="/products"
            className="text-primary flex items-center hover:underline font-medium"
          >
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.id}
              className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="aspect-[4/5] relative">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(
                      category.name
                    )}`}
                  ></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg md:text-xl font-semibold mb-1">
                  {category.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">
                    {category._count?.products || 0} Products
                  </span>
                  <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Products Component with modern card design
const FeaturedProducts = ({ products }) => {
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold relative">
            <span className="relative z-10">Featured Products</span>
            <span className="absolute bottom-0 left-0 h-3 w-1/2 bg-primary/20 z-0"></span>
          </h2>
          <Link
            href="/products"
            className="text-primary flex items-center hover:underline font-medium"
          >
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group"
            >
              <div className="relative">
                <Link
                  href={`/products/${product.slug}`}
                  className="block relative aspect-square"
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 ${getProductColor(
                        product.name
                      )} flex items-center justify-center`}
                    >
                      <span className="font-medium text-gray-500">
                        {product.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Link>
                {product.hasSale && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </span>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <button
                    aria-label="Add to wishlist"
                    className="bg-white rounded-full p-2 shadow-md transition-transform hover:scale-110"
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    aria-label="Quick shop"
                    className="bg-white rounded-full p-2 shadow-md transition-transform hover:scale-110"
                  >
                    <ShoppingCart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-1.5">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3"
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

                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-sm md:text-base font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex flex-wrap items-center justify-between mt-2">
                  <div>
                    {product.hasSale ? (
                      <div className="flex items-center">
                        <span className="font-bold text-sm md:text-base">
                          ₹{product.basePrice}
                        </span>
                        <span className="text-gray-500 line-through text-xs ml-2">
                          ₹{product.regularPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-sm md:text-base">
                        ₹{product.basePrice}
                      </span>
                    )}
                  </div>

                  {product.flavors > 1 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {product.flavors} flavors
                    </span>
                  )}
                </div>

                <Link href={`/products/${product.slug}`}>
                  <Button size="sm" className="w-full mt-3 py-1">
                    Add to Cart
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Benefits Section with modern cards
const BenefitsSection = () => {
  const benefits = [
    {
      title: "Premium Quality",
      description:
        "Lab-tested supplements made with high-quality ingredients for maximum effectiveness.",
      icon: "🏆",
    },
    {
      title: "Fast Delivery",
      description:
        "Get your supplements delivered to your doorstep within 2-3 business days.",
      icon: "🚚",
    },
    {
      title: "Expert Support",
      description:
        "Our team of fitness experts is available to help you choose the right supplements.",
      icon: "👨‍⚕️",
    },
    {
      title: "Secure Payments",
      description: "Shop with confidence with our 100% secure payment gateway.",
      icon: "🔒",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 relative inline-flex mx-auto">
          <span className="relative z-10">Why Choose Us</span>
          <span className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 z-0"></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 relative inline-flex mx-auto">
          <span className="relative z-10">What Our Customers Say</span>
          <span className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 z-0"></span>
        </h2>

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
const TrendingSection = ({ products }) => {
  // Reuse the same function to get consistent product colors
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

    const index =
      name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-10">
          <div className="mr-4 bg-primary/10 p-2 rounded-full">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold relative">
            <span className="relative z-10">Trending Now</span>
            <span className="absolute bottom-0 left-0 h-3 w-1/2 bg-primary/20 z-0"></span>
          </h2>
        </div>

        <div className="flex overflow-x-auto pb-4 md:grid md:grid-cols-4 gap-4 md:gap-6 snap-x">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[220px] md:w-auto snap-start bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <Link
                href={`/products/${product.slug}`}
                className="block relative aspect-square"
              >
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 220px, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 ${getProductColor(
                      product.name
                    )} flex items-center justify-center`}
                  >
                    <span className="font-medium text-gray-500">
                      {product.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </Link>

              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-sm md:text-base font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm md:text-base">
                    ₹{product.basePrice}
                  </span>
                  <Link href={`/products/${product.slug}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-2 py-1 text-xs"
                    >
                      Quick View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Join Our Fitness Community
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

// Home page component
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch featured products and categories
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetchApi("/public/products?featured=true&limit=8"),
          fetchApi("/public/categories"),
        ]);

        setFeaturedProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data.categories || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading amazing products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Oops! Something went wrong.</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroCarousel />
      <AnnouncementBanner />
      <FeaturedCategories categories={categories.slice(0, 8)} />
      <FeaturedProducts products={featuredProducts} />
      <BenefitsSection />
      <TestimonialsSection />
      <TrendingSection products={featuredProducts.slice().reverse()} />
      <NewsletterSection />
    </div>
  );
}
