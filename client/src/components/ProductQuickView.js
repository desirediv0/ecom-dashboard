"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export default function ProductQuickView({ product, open, onOpenChange }) {
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [productDetails, setProductDetails] = useState(null);
  const [imgSrc, setImgSrc] = useState("");

  // Reset states when product changes or dialog closes
  useEffect(() => {
    if (!open) {
      // Reset everything when dialog closes
      setSelectedFlavor(null);
      setSelectedWeight(null);
      setSelectedVariant(null);
      setQuantity(1);
      setError(null);
      setSuccess(false);
      setProductDetails(null);
      setImgSrc("");
      return;
    }

    if (product) {
      // Set initial image when product changes
      setImgSrc(product.image || "/product-placeholder.jpg");
    }
  }, [product, open]);

  // Fetch product details when product changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product || !open) return;

      setLoading(true);
      try {
        // Fetch detailed product info
        const response = await fetchApi(`/public/products/${product.slug}`);
        if (response.data && response.data.product) {
          setProductDetails(response.data.product);

          // Update image if available
          if (
            response.data.product.images &&
            response.data.product.images.length > 0
          ) {
            setImgSrc(
              response.data.product.images[0].url ||
                response.data.product.image ||
                "/product-placeholder.jpg"
            );
          }

          // Set default selections
          if (response.data.product.flavorOptions?.length > 0) {
            setSelectedFlavor(response.data.product.flavorOptions[0]);
          }

          if (response.data.product.weightOptions?.length > 0) {
            setSelectedWeight(response.data.product.weightOptions[0]);
          }

          // If no flavor/weight options but variants exist, use the first variant
          if (
            response.data.product.variants?.length > 0 &&
            (!response.data.product.flavorOptions?.length ||
              !response.data.product.weightOptions?.length)
          ) {
            setSelectedVariant(response.data.product.variants[0]);
          }
        } else {
          setError("Product details not available");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [product, open]);

  // Fetch the variant when selections change
  useEffect(() => {
    const fetchVariant = async () => {
      if (
        !selectedFlavor ||
        !selectedWeight ||
        !productDetails ||
        !productDetails.id
      )
        return;

      try {
        setLoading(true);
        const response = await fetchApi(
          `/public/product-variant?productId=${productDetails.id}&flavorId=${selectedFlavor.id}&weightId=${selectedWeight.id}`
        );

        if (response.data && response.data.variant) {
          setSelectedVariant(response.data.variant);
          setError(null);
        } else {
          setSelectedVariant(null);
          setError("This combination is not available");
        }
      } catch (err) {
        console.error("Error fetching variant:", err);
        setError("Could not find this product variant");
        setSelectedVariant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVariant();
  }, [selectedFlavor, selectedWeight, productDetails]);

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;
    if (
      selectedVariant &&
      selectedVariant.quantity > 0 &&
      newQuantity > selectedVariant.quantity
    )
      return;
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    setAddingToCart(true);
    setError(null);
    setSuccess(false);

    // If no variant is selected but product has variants, use the first one
    let variantToAdd = selectedVariant;

    if (!variantToAdd && productDetails?.variants?.length > 0) {
      variantToAdd = productDetails.variants[0];
    }

    if (!variantToAdd) {
      setError("No product variant available");
      setAddingToCart(false);
      return;
    }

    try {
      await addToCart(variantToAdd.id, quantity);
      setSuccess(true);

      // Auto close after success notification
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Format price display
  const getPriceDisplay = () => {
    // If we have a selected variant, show its price
    if (selectedVariant) {
      if (selectedVariant.salePrice) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(selectedVariant.salePrice)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {formatCurrency(selectedVariant.price)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-2xl font-bold">
          {formatCurrency(selectedVariant.price)}
        </span>
      );
    }

    // If no variant but product details available, show base price
    if (productDetails) {
      if (productDetails.hasSale) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(productDetails.basePrice)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {formatCurrency(productDetails.regularPrice)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-2xl font-bold">
          {formatCurrency(productDetails.basePrice)}
        </span>
      );
    }

    // Fallback to product from props if no details fetched yet
    if (product) {
      if (product.hasSale) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(product.basePrice)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {formatCurrency(product.regularPrice)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-2xl font-bold">
          {formatCurrency(product.basePrice)}
        </span>
      );
    }

    return null;
  };

  if (!product) return null;

  // Use the detailed product info if available, otherwise fall back to the basic product
  const displayProduct = productDetails || product;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{displayProduct.name}</DialogTitle>
        </DialogHeader>

        {loading && !productDetails ? (
          <div className="py-8 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Product Image */}
            <div className="relative h-72 md:h-full rounded-md overflow-hidden bg-gray-50 shadow-sm">
              <Image
                src={imgSrc}
                alt={displayProduct.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 400px"
                onError={() => setImgSrc("/product-placeholder.jpg")}
              />
              {displayProduct.hasSale && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  SALE
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Item added to cart successfully
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}

              {/* Price */}
              <div className="mb-4">{getPriceDisplay()}</div>

              {/* Rating */}
              {displayProduct.avgRating > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(displayProduct.avgRating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({displayProduct.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {displayProduct.description || "No description available"}
              </p>

              {/* Flavor selection */}
              {productDetails?.flavorOptions &&
                productDetails.flavorOptions.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flavor
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {productDetails.flavorOptions.map((flavor) => (
                        <button
                          key={flavor.id}
                          type="button"
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`px-3 py-2 rounded-md border text-sm transition-all ${
                            selectedFlavor?.id === flavor.id
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {flavor.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Weight selection */}
              {productDetails?.weightOptions &&
                productDetails.weightOptions.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {productDetails.weightOptions.map((weight) => (
                        <button
                          key={weight.id}
                          type="button"
                          onClick={() => setSelectedWeight(weight)}
                          className={`px-3 py-2 rounded-md border text-sm transition-all ${
                            selectedWeight?.id === weight.id
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {weight.value} {weight.unit}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Stock Availability */}
              {selectedVariant && (
                <div className="mb-4">
                  <span
                    className={`text-sm ${
                      selectedVariant.quantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedVariant.quantity > 0
                      ? `In Stock (${selectedVariant.quantity} available)`
                      : "Out of Stock"}
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2.5 rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1 || loading}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-2.5 border-t border-b border-gray-300 bg-white min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2.5 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={
                      loading ||
                      (selectedVariant &&
                        selectedVariant.quantity > 0 &&
                        quantity >= selectedVariant.quantity)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mt-auto">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 py-6"
                  disabled={
                    loading ||
                    addingToCart ||
                    (!selectedVariant &&
                      (!productDetails?.variants ||
                        productDetails.variants.length === 0)) ||
                    (selectedVariant && selectedVariant.quantity < 1)
                  }
                >
                  {addingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Link
                  href={`/products/${displayProduct.slug}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full py-6">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
