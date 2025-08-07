"use client";
import { formatCurrency, fetchApi } from "@/lib/utils";
import { Eye, Heart, Star } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductQuickView from "./ProductQuickView";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

// Helper function to calculate discount percentage
const calculateDiscountPercentage = (regularPrice, salePrice) => {
  if (!regularPrice || !salePrice || regularPrice <= salePrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

const ProducCard = ({ product }) => {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [wishlistItems, setWishlistItems] = useState({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState({});

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch wishlist status for this product
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!isAuthenticated || typeof window === "undefined") return;

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

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
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

  return (
    <div
      key={product.id}
      className="bg-white overflow-hidden transition-all hover:shadow-lg shadow-md rounded-sm group h-full"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <Image
            src={(() => {
              // Find the variant with the lowest weight
              let selectedVariant = null;
              if (product.variants && product.variants.length > 0) {
                selectedVariant = product.variants.reduce((min, v) => {
                  if (!v.weight || typeof v.weight.value !== "number")
                    return min;
                  if (!min || (min.weight && v.weight.value < min.weight.value))
                    return v;
                  return min;
                }, null);
                // fallback: if no variant has weight, use first variant
                if (!selectedVariant) selectedVariant = product.variants[0];
              }
              if (
                selectedVariant &&
                selectedVariant.images &&
                selectedVariant.images.length > 0
              ) {
                const primaryImg = selectedVariant.images.find(
                  (img) => img.isPrimary
                );
                if (primaryImg && primaryImg.url)
                  return getImageUrl(primaryImg.url);
                if (selectedVariant.images[0].url)
                  return getImageUrl(selectedVariant.images[0].url);
              }
              if (product.image) return getImageUrl(product.image);
              return "/placeholder.jpg";
            })()}
            alt={product.name}
            fill
            className="object-contain px-4 transition-transform md:group-hover:scale-105 scale-150 md:scale-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.hasSale && (
            <>
              {/* SALE badge on left */}
              <div className="absolute top-3 left-3 z-10">
                <div className=" bg-red-500  border border-red-400/80 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  SALE
                </div>
              </div>

              {/* Discount percentage badge on right */}
              {(() => {
                const discountPercent = calculateDiscountPercentage(
                  product.regularPrice,
                  product.basePrice
                );
                if (discountPercent > 0) {
                  return (
                    <div className="absolute top-3 right-3 z-10">
                      <div className=" bg-green-500  border border-green-400/80 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {discountPercent}% OFF
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 backdrop-blur-[2px] flex justify-center py-1 md:py-3 md:bg-opacity-0 md:group-hover:bg-opacity-70 md:translate-y-full md:group-hover:translate-y-0 transition-transform">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-primary/80 rounded-full p-2"
              onClick={(e) => {
                e.preventDefault();
                handleQuickView(product);
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

      <div className="p-3 md:p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 md:h-4 md:w-4"
                fill={
                  i < Math.round(product.avgRating || 0)
                    ? "currentColor"
                    : "none"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1 md:ml-2">
            ({product.reviewCount || 0})
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="hover:text-primary">
          <h3 className="font-medium uppercase mb-2 line-clamp-2 text-xs md:text-sm">
            {product.name}
          </h3>
          {/* Show lowest weight variant's flavor and weight */}
          {(() => {
            let selectedVariant = null;
            if (product.variants && product.variants.length > 0) {
              selectedVariant = product.variants.reduce((min, v) => {
                if (!v.weight || typeof v.weight.value !== "number") return min;
                if (!min || (min.weight && v.weight.value < min.weight.value))
                  return v;
                return min;
              }, null);
              if (!selectedVariant) selectedVariant = product.variants[0];
            }
            if (!selectedVariant) return null;
            const flavor = selectedVariant.flavor?.name;
            const weight = selectedVariant.weight?.value;
            const unit = selectedVariant.weight?.unit;
            if (flavor || (weight && unit)) {
              return (
                <div className="text-xs text-gray-500 mb-1">
                  {flavor}
                  {flavor && weight && unit ? " • " : ""}
                  {weight && unit ? `${weight} ${unit}` : ""}
                </div>
              );
            }
            return null;
          })()}
        </Link>

        <div className="flex items-center justify-center mb-2 flex-col md:flex-row">
          {product.hasSale ? (
            <div className="flex items-center flex-col md:flex-row">
              <span className="font-bold text-base md:text-lg text-primary">
                {formatCurrency(product.basePrice)}
              </span>
              <span className="text-gray-500 line-through text-xs md:text-sm ml-1 md:ml-2">
                {formatCurrency(product.regularPrice)}
              </span>
            </div>
          ) : (
            <span className="font-bold text-base md:text-lg text-primary">
              {formatCurrency(product.basePrice)}
            </span>
          )}
        </div>

        {/* {product.flavors > 1 && (
                            <span className="text-xs text-gray-500 block">
                              {product.flavors} variants
                            </span>
                          )} */}

        <Button
          onClick={() => handleAddToCart(product)}
          variant="outline"
          size="sm"
          className="w-full p-2"
          disabled={isAddingToCart[product.id]}
        >
          {isAddingToCart[product.id] ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Quick View Dialog */}
      <ProductQuickView
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </div>
  );
};

export default ProducCard;
