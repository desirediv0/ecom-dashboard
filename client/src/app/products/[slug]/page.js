"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  Minus,
  Plus,
  AlertCircle,
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function ProductDetailPage({ params }) {
  const { slug } = params;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const { addToCart } = useCart();

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchApi(`/public/products/${slug}`);
        const productData = response.data.product;
        setProduct(productData);
        setRelatedProducts(response.data.relatedProducts || []);

        // Set main image
        if (productData.images && productData.images.length > 0) {
          setMainImage(productData.images[0]);
        }

        // Set default flavor and weight if available
        if (productData.flavorOptions && productData.flavorOptions.length > 0) {
          setSelectedFlavor(productData.flavorOptions[0]);
        }

        if (productData.weightOptions && productData.weightOptions.length > 0) {
          setSelectedWeight(productData.weightOptions[0]);
        }

        // Set default variant if no flavor or weight options
        if (
          (!productData.flavorOptions ||
            productData.flavorOptions.length === 0) &&
          (!productData.weightOptions ||
            productData.weightOptions.length === 0) &&
          productData.variants &&
          productData.variants.length > 0
        ) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  // Fetch selected variant when flavor or weight changes
  useEffect(() => {
    const fetchVariant = async () => {
      // If product has no flavor/weight options, don't fetch variant
      if (
        (!product?.flavorOptions || product.flavorOptions.length === 0) &&
        (!product?.weightOptions || product.weightOptions.length === 0)
      ) {
        return;
      }

      // Only try to fetch variant if both flavor and weight are selected
      if (!selectedFlavor || !selectedWeight || !product) return;

      try {
        const response = await fetchApi(
          `/public/product-variant?productId=${product.id}&flavorId=${selectedFlavor.id}&weightId=${selectedWeight.id}`
        );

        setSelectedVariant(response.data.variant);
      } catch (err) {
        console.error("Error fetching variant:", err);
        setSelectedVariant(null);
      }
    };

    fetchVariant();
  }, [selectedFlavor, selectedWeight, product]);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !product) return;

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        const wishlistItems = response.data.wishlistItems || [];
        const inWishlist = wishlistItems.some(
          (item) => item.productId === product.id
        );
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, product]);

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
    if (!selectedVariant) {
      // If no variant is selected but product has variants, use the first one
      if (product?.variants && product.variants.length > 0) {
        setIsAddingToCart(true);
        setCartSuccess(false);

        try {
          await addToCart(product.variants[0].id, quantity);
          setCartSuccess(true);

          // Clear success message after 3 seconds
          setTimeout(() => {
            setCartSuccess(false);
          }, 3000);
        } catch (err) {
          console.error("Error adding to cart:", err);
        } finally {
          setIsAddingToCart(false);
        }
      }
      return;
    }

    setIsAddingToCart(true);
    setCartSuccess(false);

    try {
      await addToCart(selectedVariant.id, quantity);
      setCartSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setCartSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${slug}`);
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isInWishlist) {
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

          setIsInWishlist(false);
          // Show success message here if needed
        }
      } else {
        // Add to wishlist
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });

        setIsInWishlist(true);
        // Show success message here if needed
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // Show error message here if needed
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Handle image change
  const handleImageChange = (image) => {
    setMainImage(image);
  };

  // Handle flavor change
  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);
  };

  // Handle weight change
  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
  };

  // Format price display
  const getPriceDisplay = () => {
    // If we have a selected variant, use its price
    if (selectedVariant) {
      if (selectedVariant.salePrice) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(selectedVariant.salePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(selectedVariant.price)}
            </span>
          </div>
        );
      }

      return (
        <span className="text-3xl font-bold">
          {formatCurrency(selectedVariant.price)}
        </span>
      );
    }

    // Fallback to product base price if no variant is selected
    if (product) {
      if (product.hasSale) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(product.basePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(product.regularPrice)}
            </span>
          </div>
        );
      }

      return (
        <span className="text-3xl font-bold">
          {formatCurrency(product.basePrice)}
        </span>
      );
    }

    return null;
  };

  // Display loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200 flex flex-col items-center text-center">
          <AlertCircle className="text-red-500 h-12 w-12 mb-4" />
          <h2 className="text-2xl font-semibold text-red-700 mb-2">
            Error Loading Product
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/products">
            <Button className="px-6">
              <ChevronRight className="mr-2 h-4 w-4" /> Browse Other Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200 flex flex-col items-center text-center">
          <AlertCircle className="text-yellow-500 h-12 w-12 mb-4" />
          <h2 className="text-2xl font-semibold text-yellow-700 mb-2">
            Product Not Found
          </h2>
          <p className="text-yellow-600 mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/products">
            <Button className="px-6">
              <ChevronRight className="mr-2 h-4 w-4" /> Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 mx-2 text-gray-400" />
        <Link href="/products" className="text-gray-500 hover:text-primary">
          Products
        </Link>
        {product?.category && (
          <>
            <ChevronRight className="h-3 w-3 mx-2 text-gray-400" />
            <Link
              href={`/category/${product.category.slug}`}
              className="text-gray-500 hover:text-primary"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 mx-2 text-gray-400" />
        <span className="text-gray-900 font-medium">{product?.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4 shadow-sm">
            <div className="relative h-[400px] md:h-[500px] w-full bg-gray-50 transition-all duration-300 hover:bg-gray-100">
              <Image
                src={mainImage?.url || "/product-placeholder.jpg"}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.hasSale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  SALE
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative h-20 w-full bg-white rounded border overflow-hidden cursor-pointer transition-all hover:opacity-80 ${
                    mainImage?.url === image.url
                      ? "ring-2 ring-primary border-primary"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => handleImageChange(image)}
                >
                  <Image
                    src={image.url || "/product-placeholder.jpg"}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="20vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col h-full">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
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
            <span className="text-sm text-gray-500">
              {product.avgRating
                ? `${product.avgRating} (${product.reviewCount} reviews)`
                : "No reviews yet"}
            </span>
          </div>

          {/* Success Message */}
          {cartSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md flex items-center border border-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              Item successfully added to your cart!
            </div>
          )}

          {/* Price */}
          <div className="mb-6">{getPriceDisplay()}</div>

          {/* Short Description */}
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            {product.shortDescription || product.description?.substring(0, 150)}
            {product.description?.length > 150 &&
              !product.shortDescription &&
              "..."}
          </p>

          {/* Flavor Selection */}
          {product.flavorOptions && product.flavorOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Flavor</h3>
              <div className="flex flex-wrap gap-2">
                {product.flavorOptions.map((flavor) => (
                  <button
                    key={flavor.id}
                    className={`px-4 py-2 rounded-md border text-sm transition-all ${
                      selectedFlavor?.id === flavor.id
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => handleFlavorChange(flavor)}
                  >
                    {flavor.image && (
                      <div className="w-4 h-4 rounded-full overflow-hidden inline-block mr-2">
                        <Image
                          src={flavor.image}
                          alt={flavor.name}
                          width={16}
                          height={16}
                        />
                      </div>
                    )}
                    {flavor.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Weight Selection */}
          {product.weightOptions && product.weightOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Weight</h3>
              <div className="flex flex-wrap gap-2">
                {product.weightOptions.map((weight) => (
                  <button
                    key={weight.id}
                    className={`px-4 py-2 rounded-md border text-sm transition-all ${
                      selectedWeight?.id === weight.id
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => handleWeightChange(weight)}
                  >
                    {weight.display}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Success/Error Messages */}
          <div className="mb-4">
            {selectedVariant &&
              selectedVariant.quantity < 5 &&
              selectedVariant.quantity > 0 && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  Only {selectedVariant.quantity} left in stock - order soon!
                </div>
              )}
            {selectedVariant && selectedVariant.quantity === 0 && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                Out of stock
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                className="p-2 border rounded-l-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isAddingToCart}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-6 py-2 border-t border-b min-w-[3rem] text-center font-medium">
                {quantity}
              </span>
              <button
                className="p-2 border rounded-r-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleQuantityChange(1)}
                disabled={
                  (selectedVariant &&
                    selectedVariant.quantity > 0 &&
                    quantity >= selectedVariant.quantity) ||
                  isAddingToCart
                }
              >
                <Plus className="h-4 w-4" />
              </button>

              <span className="ml-4 text-sm text-gray-500">
                {selectedVariant
                  ? selectedVariant.quantity > 0
                    ? `${selectedVariant.quantity} available`
                    : "Out of stock"
                  : product?.variants && product.variants.length > 0
                  ? `${product.variants[0].quantity || 0} available`
                  : "Select options"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              className="flex-1 flex items-center justify-center gap-2 py-6 text-base"
              size="lg"
              onClick={handleAddToCart}
              disabled={
                isAddingToCart ||
                (selectedVariant && selectedVariant.quantity < 1) ||
                (!selectedVariant &&
                  (!product?.variants ||
                    product.variants.length === 0 ||
                    product.variants[0].quantity < 1))
              }
            >
              {isAddingToCart ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className={`flex-1 flex items-center justify-center gap-2 py-6 text-base ${
                isInWishlist
                  ? "text-red-600 border-red-600 hover:bg-red-50"
                  : ""
              }`}
              size="lg"
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
            >
              <Heart
                className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
              />
              {isAddingToWishlist
                ? "Processing..."
                : isInWishlist
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 border-gray-300"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                // Show notification
                alert("Link copied to clipboard!");
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Product Metadata */}
          <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
            <div className="flex">
              <span className="font-medium w-32 text-gray-700">SKU:</span>
              <span className="text-gray-600">
                {selectedVariant ? selectedVariant.sku : "Select options"}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-700">Category:</span>
              <Link
                href={`/category/${product.category?.slug}`}
                className="text-primary hover:underline"
              >
                {product.category?.name}
              </Link>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-700">Tags:</span>
              <div className="text-gray-600">
                {product.tags?.map((tag, index) => (
                  <span key={index}>
                    <Link
                      href={`/products?tag=${tag}`}
                      className="text-primary hover:underline"
                    >
                      {tag}
                    </Link>
                    {index < product.tags.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "description"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "nutrition"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("nutrition")}
            >
              Nutrition Facts
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "reviews"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({product.reviewCount || 0})
            </button>
          </div>
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>

              {product.highlights && product.highlights.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                  <ul className="space-y-2 pl-5 list-disc marker:text-primary">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="text-gray-700">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.directions && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">
                    Directions for Use
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.directions}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "nutrition" && (
            <div>
              {product.nutritionFacts ? (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-6">
                    Nutrition Facts
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 border-b border-gray-200 font-medium text-gray-700">
                            Nutrient
                          </th>
                          <th className="text-left p-4 border-b border-gray-200 font-medium text-gray-700">
                            Amount Per Serving
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(product.nutritionFacts).map(
                          ([key, value], index) => (
                            <tr
                              key={key}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="p-4 border-b border-gray-200 font-medium">
                                {key}
                              </td>
                              <td className="p-4 border-b border-gray-200">
                                {value}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500 mb-2">
                    Nutrition information not available for this product.
                  </p>
                  <p className="text-sm text-gray-400">
                    Please contact customer service for more information.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-8">
                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-8"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {review.user.name}
                          </p>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4"
                                fill={
                                  i < review.rating ? "currentColor" : "none"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="font-medium text-gray-800 mt-3">
                        {review.title}
                      </h4>
                      <p className="mt-2 text-gray-600 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500 mb-6">
                    No reviews yet. Be the first to review this product!
                  </p>
                  <Button
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push("/login?redirect=review");
                        return;
                      }
                      // Review logic would be implemented in a real app
                    }}
                    className="px-8 py-2"
                  >
                    Write a Review
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-shadow hover:shadow-md"
              >
                <div className="relative h-64 w-full bg-gray-100">
                  <Image
                    src={product.image || "/product-placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {product.hasSale && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-2">
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

                  <div>
                    {product.hasSale ? (
                      <div className="flex items-center">
                        <span className="font-bold text-lg">
                          {formatCurrency(product.basePrice)}
                        </span>
                        <span className="text-gray-500 line-through text-sm ml-2">
                          {formatCurrency(product.regularPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-lg">
                        {formatCurrency(product.basePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
