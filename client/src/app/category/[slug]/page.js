"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
  ShoppingCart,
} from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/images/blog-placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState({});

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  // Fetch category and products
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // Parse sort option into API parameters
        let sort = "createdAt";
        let order = "desc";

        switch (sortOption) {
          case "newest":
            sort = "createdAt";
            order = "desc";
            break;
          case "oldest":
            sort = "createdAt";
            order = "asc";
            break;
          case "name-asc":
            sort = "name";
            order = "asc";
            break;
          case "name-desc":
            sort = "name";
            order = "desc";
            break;
          default:
            break;
        }

        const response = await fetchApi(
          `/public/categories/${slug}/products?page=${pagination.page}&limit=${pagination.limit}&sort=${sort}&order=${order}`
        );

        setCategory(response.data.category);
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || pagination);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug, pagination.page, pagination.limit, sortOption]);

  // Add handleAddToWishlist function
  const handleAddToWishlist = async (product, e) => {
    e.preventDefault(); // Prevent navigation
    if (!isAuthenticated) {
      router.push(`/login?redirect=/category/${slug}`);
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
          toast.success("Removed from wishlist");
        }
      } else {
        // Add to wishlist
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });

        setWishlistItems((prev) => ({ ...prev, [product.id]: true }));
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // Add useEffect to fetch wishlist status
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

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle quick view
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  // Loading state
  if (loading && !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-red-700">
              Error Loading Category
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Category header */}
      {category && (
        <div className="mb-10">
          <div className="flex items-center mb-2">
            <Link href="/" className="text-gray-500 hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="text-gray-500 hover:text-primary">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{category.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-gray-600 max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>

            {category.image && (
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <p className="text-gray-600">
            Showing {products.length} of {pagination.total} products
          </p>
        </div>

        <div className="flex items-center mt-4 sm:mt-0">
          <label htmlFor="sort" className="text-sm mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            name="sort"
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            onChange={handleSortChange}
            value={sortOption}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center border">
          <div className="text-gray-400 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-3">No products found</h2>
          <p className="text-gray-600 mb-6">
            There are no products in this category yet.
          </p>
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white overflow-hidden transition-all hover:shadow-lg shadow-md rounded-sm group"
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
                          if (
                            !min ||
                            (min.weight && v.weight.value < min.weight.value)
                          )
                            return v;
                          return min;
                        }, null);
                        // fallback: if no variant has weight, use first variant
                        if (!selectedVariant)
                          selectedVariant = product.variants[0];
                      }
                      if (
                        selectedVariant &&
                        selectedVariant.images &&
                        selectedVariant.images.length > 0
                      ) {
                        const primaryImg = selectedVariant.images.find(
                          (img) => img.isPrimary
                        );
                        if (primaryImg && primaryImg.url) {
                          return primaryImg.url.startsWith("http")
                            ? primaryImg.url
                            : `https://desirediv-storage.blr1.digitaloceanspaces.com/${primaryImg.url}`;
                        }
                        if (selectedVariant.images[0].url) {
                          return selectedVariant.images[0].url.startsWith(
                            "http"
                          )
                            ? selectedVariant.images[0].url
                            : `https://desirediv-storage.blr1.digitaloceanspaces.com/${selectedVariant.images[0].url}`;
                        }
                      }
                      if (product.image) {
                        return product.image.startsWith("http")
                          ? product.image
                          : `https://desirediv-storage.blr1.digitaloceanspaces.com/${product.image}`;
                      }
                      return "/placeholder.jpg";
                    })()}
                    alt={product.name}
                    fill
                    className="object-contain px-4 transition-transform md:group-hover:scale-105 scale-150 md:scale-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
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

                <Link
                  href={`/products/${product.slug}`}
                  className="hover:text-primary"
                >
                  <h3 className="font-medium uppercase mb-2 line-clamp-2 text-xs md:text-sm">
                    {product.name}
                  </h3>
                  {/* Show lowest weight variant's flavor and weight */}
                  {(() => {
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
                      if (!selectedVariant)
                        selectedVariant = product.variants[0];
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

                <div className="flex items-center justify-center mb-2 flex-col">
                  {product.hasSale ? (
                    <div className="flex items-center flex-col">
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
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center mt-10">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronUp className="h-4 w-4 rotate-90" />
            </Button>

            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1;
              // Show first page, last page, and pages around the current page
              if (
                page === 1 ||
                page === pagination.pages ||
                (page >= pagination.page - 1 && page <= pagination.page + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              }

              // Show ellipsis for skipped pages
              if (
                (page === 2 && pagination.page > 3) ||
                (page === pagination.pages - 1 &&
                  pagination.page < pagination.pages - 2)
              ) {
                return <span key={page}>...</span>;
              }

              return null;
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
      )}

      {/* Product Quick View */}
      <ProductQuickView
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
