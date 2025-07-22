"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, fetchProductsByType } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Heart, Eye } from "lucide-react";
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
import CategoriesCarousel from "@/components/catgry";
import Headtext from "@/components/ui/headtext";
import ProductQuickView from "@/components/ProductQuickView";
import { useRouter } from "next/navigation";
import { bg2, bg2sm, bg3, bg3sm, bg4, bg4sm } from "@/assets";
import SupplementStoreUI from "@/components/SupplementStoreUI";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import CategoryGrid from "@/components/CategoryGrid";
import BrandCarousel from "@/components/BrandCarousel";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);
  const [autoplay, setAutoplay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  const slides = [
    {
      ctaLink: "/category/protein",
      img: bg4,
      smimg: bg4sm,
      title: "Vitamins & Minerals",
      subtitle: "Support Your Health",
    },
    {
      ctaLink: "/category/protein",
      img: bg2,
      smimg: bg2sm,
      title: "Protein Collection",
      subtitle: "Build Muscle Faster",
    },
    {
      ctaLink: "/category/pre-workout",
      img: bg3,
      smimg: bg3sm,
      title: "Pre-Workout Power",
      subtitle: "Maximize Your Energy",
    },
  ];

  // Handle responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleSlideClick = (ctaLink) => {
    router.push(ctaLink);
  };

  return (
    <div className="relative w-full">
      {/* Mobile: Smaller height, Desktop: Larger height */}
      <div className="relative overflow-hidden ">
        <Carousel setApi={setApi} className="h-full w-full">
          <CarouselContent className="h-full">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="h-full p-0">
                <div
                  className="relative h-[180px] sm:h-[250px] md:h-[350px] w-full cursor-pointer group overflow-hidden"
                  onClick={() => handleSlideClick(slide.ctaLink)}
                >
                  {/* Background Image */}
                  <Image
                    src={isMobile ? slide.smimg : slide.img}
                    alt={slide.title || "Hero banner"}
                    fill
                    className="object-cover transition-transform duration-700  "
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Controls - Better positioned and sized */}
          <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 z-30 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm" />
          <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 z-30 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm" />

          {/* Dot Indicators - Better responsive sizing */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2  rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Autoplay Toggle - Better positioned */}
          <div className="absolute top-4 right-4 z-30">
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6  bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
              onClick={() => setAutoplay(!autoplay)}
              aria-label={autoplay ? "Pause slideshow" : "Play slideshow"}
            >
              {autoplay ? (
                <div className="w-2 h-2 flex space-x-0.5">
                  <div className="w-1 h-full bg-current"></div>
                  <div className="w-1 h-full bg-current"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-t-[4px] sm:border-t-[6px] border-t-transparent border-b-[4px] sm:border-b-[6px] border-b-transparent border-l-[6px] sm:border-l-[8px] border-l-current ml-0.5"></div>
              )}
            </Button>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

// Announcement Banner
const AnnouncementBanner = () => {
  return (
    <div className="bg-primary/10 py-2 md:py-4 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-center">
          <div className="flex items-center">
            <span className="text-xs md:text-base font-medium">
              ⚡ FREE SHIPPING ON ORDERS ABOVE ₹999
            </span>
          </div>
          <div className="hidden md:flex items-center">
            <span className="text-sm md:text-base font-medium">
              🎁 GET A FREE SHAKER WITH PROTEIN PURCHASES
            </span>
          </div>
          <div className="hidden md:flex items-center ">
            <span className="text-sm md:text-base font-medium">
              🔥 USE CODE <strong>FIT10</strong> FOR 10% OFF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured Products Component with modern card design and carousel
const FeaturedProducts = ({
  products = [],
  isLoading = false,
  error = null,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [api, setApi] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wishlistItems, setWishlistItems] = useState({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState({});
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const { addToCart } = useCart();

  // Fetch wishlist status for all products
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });
        const items = response.data.wishlistItems.reduce((acc, item) => {
          acc[item.productId] = true;
          return acc;
        }, {});
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlistStatus();
  }, [isAuthenticated]);

  const handleAddToWishlist = async (product, e) => {
    e.preventDefault(); // Prevent navigation
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }

    setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: true }));

    try {
      if (wishlistItems[product.id]) {
        // Get wishlist to find the item ID
        const wishlistResponse = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        const wishlistItem = wishlistResponse.data.wishlistItems.find(
          (item) => item.productId === product.id
        );

        if (wishlistItem) {
          await fetchApi(`/users/wishlist/${wishlistItem.id}`, {
            method: "DELETE",
            credentials: "include",
          });

          setWishlistItems((prev) => ({ ...prev, [product.id]: false }));
        }
      } else {
        // Add to wishlist
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });

        setWishlistItems((prev) => ({ ...prev, [product.id]: true }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // Handle add to cart click
  const handleAddToCart = async (product) => {
    setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }));
    try {
      if (!isAuthenticated) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }
      // If product has no variants, show error
      if (!product || !product.variants || product.variants.length === 0) {
        // Try to get default variant from backend
        const response = await fetchApi(
          `/public/products/${product.id}/variants`
        );
        const variants = response.data.variants || [];

        if (variants.length === 0) {
          toast.error("This product is currently not available");
          return;
        }

        // Use first variant as default
        const variantId = variants[0].id;
        await addToCart(variantId, 1);
        toast.success(`${product.name} added to cart`);
      } else {
        // Get the first variant (default)
        const variantId = product.variants[0].id;
        await addToCart(variantId, 1);
        toast.success(`${product.name} added to cart`);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // Handle slide change
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
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product, index) => (
              <CarouselItem
                key={product.id || product.slug || index}
                className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6 py-5 md:py-10"
              >
                <div className="bg-white overflow-hidden transition-all hover:shadow-lg shadow-md rounded-sm group h-full">
                  <Link href={`/products/${product.slug || ""}`}>
                    <div className="relative h-64 w-full  overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name || "Product"}
                          fill
                          className="object-contain px-4 transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <Image
                          src="/product-placeholder.jpg"
                          alt={product.name || "Product"}
                          fill
                          className="object-contain px-4 transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      )}
                      {product.hasSale && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                          SALE
                        </span>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 backdrop-blur-[2px] flex justify-center py-1 md:py-3 md:bg-opacity-0 md:group-hover:bg-opacity-70 md:translate-y-full md:group-hover:translate-y-0 transition-transform">
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
                          className={`text-white hover:text-white hover:bg-primary/80 rounded-full p-2 mx-2 ${
                            wishlistItems[product.id] ? "text-red-500" : ""
                          }`}
                          onClick={(e) => handleAddToWishlist(product, e)}
                          disabled={isAddingToWishlist[product.id]}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              wishlistItems[product.id] ? "fill-current" : ""
                            }`}
                          />
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

                    {/* {(product.flavors || 0) > 1 && (
                      <span className="text-xs text-gray-500 block">
                        {product.flavors} variants
                      </span>
                    )} */}

                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={isAddingToCart[product.id]}
                    >
                      {isAddingToCart[product.id] ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Controls */}
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-white/90 hover:bg-white hover:text-black border-gray-200 text-gray-700 shadow-lg" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-white/90 hover:bg-white hover:text-black border-gray-200 text-gray-700 shadow-lg" />
        </Carousel>
      </div>

      <div className="text-center mt-2">
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
  // Expanded testimonials data (6 entries, no images, initials only)
  const testimonials = [
    {
      name: "Yatharth S.",
      role: "Bodybuilding Gold Medalist",
      quote:
        "Genuine Nutrition products are always authentic and delivery is super quick. Highly recommended!",
      rating: 5,
      verified: true,
    },
    {
      name: "Pratik G.",
      role: "Rowing Athlete",
      quote:
        "Been a customer for 2 years. Never disappointed with quality or service.",
      rating: 4.5,
      verified: true,
    },
    {
      name: "Monika L.",
      role: "Fitness Influencer",
      quote:
        "Shipping is fast and the supplements are genuine. Trustworthy site!",
      rating: 5,
      verified: true,
    },
    {
      name: "Amit K.",
      role: "Gym Trainer",
      quote:
        "My clients and I both use Genuine Nutrition. Great results every time.",
      rating: 5,
      verified: true,
    },
    {
      name: "Sneha P.",
      role: "Yoga Coach",
      quote: "Clean ingredients and good offers. I always buy from here.",
      rating: 4,
      verified: true,
    },
    {
      name: "Rohit S.",
      role: "Sports Nutritionist",
      quote: "Customer support is helpful and products are top-notch.",
      rating: 5,
      verified: true,
    },
  ];

  // Carousel logic
  const [api, setApi] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  return (
    <section className="py-10 bg-white relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <Headtext text="WHAT OUR CUSTOMERS SAY" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <Carousel setApi={setApi} opts={{ align: "center", loop: true }}>
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/3 px-2">
                  <div className="bg-gray-50 rounded-xl shadow-md p-5 flex flex-col h-full justify-between">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/80 text-white font-bold text-lg mr-3">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-gray-900 mb-0.5">
                          {testimonial.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-0.5">
                          {testimonial.role}
                        </p>
                        {testimonial.verified && (
                          <div className="flex items-center text-green-600 text-xs font-medium">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="white"
                              />
                              <path
                                d="M9 12l2 2l4-4"
                                stroke="green"
                                strokeWidth="2"
                                fill="none"
                              />
                            </svg>
                            Verified customer
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => {
                        const isHalf = testimonial.rating - i === 0.5;
                        return (
                          <span key={i}>
                            {isHalf ? (
                              <svg
                                className="w-4 h-4 text-yellow-400 inline"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <defs>
                                  <linearGradient id={`half${index}${i}`}>
                                    <stop offset="50%" stopColor="#facc15" />
                                    <stop
                                      offset="50%"
                                      stopColor="white"
                                      stopOpacity="1"
                                    />
                                  </linearGradient>
                                </defs>
                                <path
                                  fill={`url(#half${index}${i})`}
                                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"
                                />
                              </svg>
                            ) : (
                              <Star
                                className={`h-4 w-4 ${
                                  i < Math.floor(testimonial.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      “{testimonial.quote}”
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 shadow" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 shadow" />
          </Carousel>
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
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products by different types
    const fetchData = async () => {
      try {
        setProductsLoading(true);

        // Fetch products by different types
        const [featuredRes, latestRes, bestsellerRes, trendingRes, newRes] =
          await Promise.allSettled([
            fetchProductsByType("featured", 8),
            fetchProductsByType("latest", 8),
            fetchProductsByType("bestseller", 8),
            fetchProductsByType("trending", 8),
            fetchProductsByType("new", 8),
          ]);

        // Set featured products (fallback to regular featured if type doesn't exist)
        if (featuredRes.status === "fulfilled") {
          setFeaturedProducts(featuredRes.value?.data?.products || []);
        } else {
          // Fallback to regular featured products
          const fallbackRes = await fetchApi(
            "/public/products?featured=true&limit=8"
          );
          setFeaturedProducts(fallbackRes?.data?.products || []);
        }

        // Set latest products
        if (latestRes.status === "fulfilled") {
          setLatestProducts(latestRes.value?.data?.products || []);
        }

        // Set bestseller products
        if (bestsellerRes.status === "fulfilled") {
          setBestsellerProducts(bestsellerRes.value?.data?.products || []);
        }

        // Set trending products
        if (trendingRes.status === "fulfilled") {
          setTrendingProducts(trendingRes.value?.data?.products || []);
        }

        // Set new products
        if (newRes.status === "fulfilled") {
          setNewProducts(newRes.value?.data?.products || []);
        }
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
      <CategoriesCarousel />
      <HeroCarousel />
      <AnnouncementBanner />

      {/* Brand Carousels */}
      <BrandCarousel tag="TOP" title="TOP BRANDS" />

      {/* Featured Categories Section */}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
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

      <BrandCarousel tag="NEW" title="NEW BRANDS" />

      {/* <GymSupplementShowcase /> */}
      <CategoryGrid />

      {/* Latest Products Section */}
      {latestProducts.length > 0 && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Headtext text="LATEST PRODUCTS" />
              <p className="text-gray-600 my-6 max-w-2xl mx-auto">
                Discover our newest additions to the collection
              </p>
            </div>

            <FeaturedProducts
              products={latestProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}

      {/* Bestseller Products Section */}
      {bestsellerProducts.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Headtext text="BEST SELLERS" />
              <p className="text-gray-600 my-6 max-w-2xl mx-auto">
                Our most popular products loved by customers
              </p>
            </div>

            <FeaturedProducts
              products={bestsellerProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}

      <SupplementStoreUI />
      {/* Trending Products Section */}
      {trendingProducts.length > 0 && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Headtext text="TRENDING NOW" />
              <p className="text-gray-600 my-6 max-w-2xl mx-auto">
                Products that are currently trending in the fitness community
              </p>
            </div>

            <FeaturedProducts
              products={trendingProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Headtext text="NEW ARRIVALS" />
              <p className="text-gray-600 my-6 max-w-2xl mx-auto">
                Fresh products just added to our collection
              </p>
            </div>

            <FeaturedProducts
              products={newProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}
      <BrandCarousel tag="HOT" title="HOT BRANDS" />

      <BenefitsSec />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
