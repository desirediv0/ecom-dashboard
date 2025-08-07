"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Heart,
  Eye,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import ProductQuickView from "@/components/ProductQuickView";
import { toast } from "sonner";
import CategoriesCarousel from "@/components/catgry";

function ProductCardSkeleton() {
  return (
    <div className="bg-white overflow-hidden shadow-md rounded-sm animate-pulse">
      <div className="h-64 w-full bg-gray-200"></div>
      <div className="p-4">
        <div className="flex justify-center mb-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-center">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function BrandPage({ params }) {
  const { slug } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const sortParam = searchParams.get("sort") || "createdAt";
  const orderParam = searchParams.get("order") || "desc";

  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [filters, setFilters] = useState({
    sort: sortParam,
    order: orderParam,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 0,
  });
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.sort !== "createdAt" || newFilters.order !== "desc") {
      params.set("sort", newFilters.sort);
      params.set("order", newFilters.order);
    }
    const newURL = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.push(newURL, { scroll: false });
  };

  // Fetch brand products with filters
  useEffect(() => {
    const fetchBrandProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", pagination.page);
        queryParams.append("limit", pagination.limit);
        const validSortFields = ["createdAt", "updatedAt", "name", "featured"];
        let sortField = filters.sort;
        if (!validSortFields.includes(sortField)) {
          sortField = "createdAt";
        }
        queryParams.append("sort", sortField);
        queryParams.append("order", filters.order);
        const res = await fetchApi(
          `/public/brand/${slug}?${queryParams.toString()}`
        );
        setBrand(res.data.brand);
        setProducts(res.data.brand.products || []);
        setPagination(res.data.pagination || {});
      } catch (err) {
        setBrand(null);
        setProducts([]);
        setPagination({ page: 1, limit: 15, total: 0, pages: 0 });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, filters, pagination.page, pagination.limit]);

  useEffect(() => {
    if (error) {
      toast.error(`Error loading products. Please try again.`);
    }
  }, [error]);

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
        // ignore
      }
    };
    fetchWishlistStatus();
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagination.page]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case "newest":
        setFilters((prev) => ({ ...prev, sort: "createdAt", order: "desc" }));
        updateURL({ ...filters, sort: "createdAt", order: "desc" });
        break;
      case "oldest":
        setFilters((prev) => ({ ...prev, sort: "createdAt", order: "asc" }));
        updateURL({ ...filters, sort: "createdAt", order: "asc" });
        break;
      case "price-low":
        setFilters((prev) => ({ ...prev, sort: "createdAt", order: "asc" }));
        updateURL({ ...filters, sort: "createdAt", order: "asc" });
        break;
      case "price-high":
        setFilters((prev) => ({ ...prev, sort: "createdAt", order: "desc" }));
        updateURL({ ...filters, sort: "createdAt", order: "desc" });
        break;
      case "name-asc":
        setFilters((prev) => ({ ...prev, sort: "name", order: "asc" }));
        updateURL({ ...filters, sort: "name", order: "asc" });
        break;
      case "name-desc":
        setFilters((prev) => ({ ...prev, sort: "name", order: "desc" }));
        updateURL({ ...filters, sort: "name", order: "desc" });
        break;
      default:
        break;
    }
  };

  const scrollToTop = () => {
    const mainContent = document.getElementById("products-main");
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    scrollToTop();
  };

  const handleAddToCart = async (product) => {
    setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }));
    try {
      if (!isAuthenticated) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }
      if (!product || !product.variants || product.variants.length === 0) {
        const response = await fetchApi(
          `/public/products/${product.id}/variants`
        );
        const variants = response.data.variants || [];
        if (variants.length === 0) {
          toast.error("This product is currently not available");
          return;
        }
        const variantId = variants[0].id;
        await addToCart(variantId, 1);
        toast.success(`${product.name} added to cart`);
      } else {
        const variantId = product.variants[0].id;
        await addToCart(variantId, 1);
        toast.success(`${product.name} added to cart`);
      }
    } catch (err) {
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  const handleAddToWishlist = async (product, e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }
    setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: true }));
    try {
      if (wishlistItems[product.id]) {
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
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });
        setWishlistItems((prev) => ({ ...prev, [product.id]: true }));
      }
    } catch (error) {
      // ignore
    } finally {
      setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoriesCarousel />
      <div id="products-main" className="mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
            {/* Display product count and sort options */}
            <div className="flex justify-between md:justify-end mb-6 items-center w-full col-span-full">
              <div className="text-sm">
                {loading && !products.length ? (
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold">{products.length}</span> of{" "}
                    <span className="font-semibold">
                      {pagination.total || 0}
                    </span>{" "}
                    products
                  </>
                )}
              </div>

              {loading && (
                <div className="text-sm text-gray-500 flex items-center ml-auto mr-4">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </div>
              )}

              <div className="inline-flex items-center border rounded-md overflow-hidden bg-white">
                <span className="px-3 py-2 text-sm">SORT BY</span>
                <select
                  id="sort"
                  name="sort"
                  className="border-l px-3 py-2 focus:outline-none"
                  onChange={handleSortChange}
                  disabled={loading}
                  value={
                    filters.sort === "createdAt" && filters.order === "desc"
                      ? "newest"
                      : filters.sort === "createdAt" && filters.order === "asc"
                      ? "oldest"
                      : filters.sort === "name" && filters.order === "asc"
                      ? "name-asc"
                      : filters.sort === "name" && filters.order === "desc"
                      ? "name-desc"
                      : "newest"
                  }
                >
                  <option value="newest">Featured</option>
                  <option value="price-low">Price, low to high</option>
                  <option value="price-high">Price, high to low</option>
                  <option value="name-asc">Alphabetically, A-Z</option>
                  <option value="name-desc">Alphabetically, Z-A</option>
                  <option value="oldest">Date, old to new</option>
                </select>
              </div>
            </div>

            {/* Products Grid with Loading State */}
            {loading && products.length === 0 ? (
              [...Array(pagination.limit || 12)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : products.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center border col-span-full">
                <div className="text-gray-400 mb-4">
                  <AlertCircle className="h-12 w-12 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold mb-3">
                  No products found
                </h2>
                <p className="text-gray-600 mb-6">
                  Try adjusting your sort option.
                </p>
              </div>
            ) : (
              products.map((product) => {
                let selectedVariant = null;
                if (product.variants && product.variants.length > 0) {
                  selectedVariant = product.variants.reduce((min, v) => {
                    if (!v.weight || typeof v.weight.value !== "number")
                      return min;
                    if (
                      !min ||
                      (min.weight && v.weight.value < min.weight.value)
                    )
                      return v;
                    return min;
                  }, null);
                  if (!selectedVariant) selectedVariant = product.variants[0];
                }
                let productImage = (() => {
                  if (
                    selectedVariant &&
                    selectedVariant.images &&
                    selectedVariant.images.length > 0
                  ) {
                    const primaryImg = selectedVariant.images.find(
                      (img) => img.isPrimary
                    );
                    if (primaryImg && primaryImg.url)
                      return primaryImg.url.startsWith("http") ||
                        primaryImg.url.startsWith("/")
                        ? primaryImg.url
                        : `https://desirediv-storage.blr1.digitaloceanspaces.com/${primaryImg.url}`;
                    if (selectedVariant.images[0].url)
                      return selectedVariant.images[0].url.startsWith("http") ||
                        selectedVariant.images[0].url.startsWith("/")
                        ? selectedVariant.images[0].url
                        : `https://desirediv-storage.blr1.digitaloceanspaces.com/${selectedVariant.images[0].url}`;
                  }
                  if (product.image)
                    return product.image.startsWith("http") ||
                      product.image.startsWith("/")
                      ? product.image
                      : `https://desirediv-storage.blr1.digitaloceanspaces.com/${product.image}`;
                  return "/placeholder.jpg";
                })();
                const basePrice =
                  selectedVariant?.basePrice ?? product.basePrice;
                const regularPrice =
                  selectedVariant?.regularPrice ?? product.regularPrice;
                const hasSale = selectedVariant?.hasSale ?? product.hasSale;
                return (
                  <div
                    key={product.id}
                    className="bg-white overflow-hidden transition-all hover:shadow-lg shadow-md rounded-sm group h-full"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-64 w-full overflow-hidden">
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          className="object-contain px-4 transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {hasSale && (
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
                        href={`/products/${product.slug}`}
                        className="hover:text-primary"
                      >
                        <h3 className="font-medium uppercase mb-2 line-clamp-2 text-sm">
                          {product.name}
                        </h3>
                        {/* Show lowest weight variant's flavor and weight */}
                        {(() => {
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
                      <div className="flex items-center justify-center mb-2">
                        {hasSale ? (
                          <div className="flex items-center">
                            <span className="font-bold text-lg text-primary">
                              {formatCurrency(basePrice)}
                            </span>
                            <span className="text-gray-500 line-through text-sm ml-2">
                              {formatCurrency(regularPrice)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-lg text-primary">
                            {formatCurrency(basePrice)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={isAddingToCart[product.id]}
                      >
                        {isAddingToCart[product.id]
                          ? "Adding..."
                          : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Restore original pagination UI */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center mt-10 mb-4">
                <div className="inline-flex items-center rounded-md overflow-hidden border divide-x">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="rounded-none border-0 hover:bg-gray-100"
                  >
                    <ChevronUp className="h-4 w-4 rotate-90" />
                  </Button>
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.page - 1 &&
                        page <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`px-3 py-2 text-sm ${
                            pagination.page === page
                              ? "bg-primary text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (
                      (page === 2 && pagination.page > 3) ||
                      (page === pagination.pages - 1 &&
                        pagination.page < pagination.pages - 2)
                    ) {
                      return (
                        <span key={page} className="px-3 py-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages || loading}
                    className="rounded-none border-0 hover:bg-gray-100"
                  >
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                </div>
              </div>
            )}

            {/* Quick View Dialog */}
            <ProductQuickView
              product={quickViewProduct}
              open={quickViewOpen}
              onOpenChange={setQuickViewOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
