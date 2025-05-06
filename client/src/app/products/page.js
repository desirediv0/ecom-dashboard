"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertCircle,
  Search,
  Heart,
  Eye,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import ProductQuickView from "@/components/ProductQuickView";
import { toast } from "sonner";

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchQuery,
    category: categorySlug,
    flavor: "",
    weight: "",
    minPrice: "",
    maxPrice: "",
    sort: "createdAt",
    order: "desc",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const { addToCart } = useCart();

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build query params from filters
        const queryParams = new URLSearchParams();

        queryParams.append("page", pagination.page);
        queryParams.append("limit", pagination.limit);

        // Add active filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });

        const response = await fetchApi(
          `/public/products?${queryParams.toString()}`
        );
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || {});
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, pagination.page, pagination.limit]);

  // Fetch categories, flavors, and weights for filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoriesRes, flavorsRes, weightsRes] = await Promise.all([
          fetchApi("/public/categories"),
          fetchApi("/public/flavors"),
          fetchApi("/public/weights"),
        ]);

        setCategories(categoriesRes.data.categories || []);
        setFlavors(flavorsRes.data.flavors || []);
        setWeights(weightsRes.data.weights || []);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Reset to page 1 when filters change
    if (pagination.page !== 1) {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  // Handle clearing filters
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      flavor: "",
      weight: "",
      minPrice: "",
      maxPrice: "",
      sort: "createdAt",
      order: "desc",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search.value;
    handleFilterChange("search", searchInput);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;

    switch (value) {
      case "newest":
        handleFilterChange("sort", "createdAt");
        handleFilterChange("order", "desc");
        break;
      case "oldest":
        handleFilterChange("sort", "createdAt");
        handleFilterChange("order", "asc");
        break;
      case "price-low":
        // Price sorting needs to be done by variants.price in the backend
        // Using createdAt as default sort for now
        handleFilterChange("sort", "createdAt");
        handleFilterChange("order", "asc");
        break;
      case "price-high":
        // Price sorting needs to be done by variants.price in the backend
        // Using createdAt as default sort for now
        handleFilterChange("sort", "createdAt");
        handleFilterChange("order", "desc");
        break;
      case "name-asc":
        handleFilterChange("sort", "name");
        handleFilterChange("order", "asc");
        break;
      case "name-desc":
        handleFilterChange("sort", "name");
        handleFilterChange("order", "desc");
        break;
      default:
        break;
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle add to cart click
  const handleAddToCart = async (product) => {
    if (!product.variants || product.variants.length === 0) {
      // No variants available
      toast.error("This product is currently not available");
      return;
    }

    try {
      // Get the first variant (default)
      const variantId = product.variants[0].id;
      await addToCart(variantId, 1);
      // Success notification is handled in the cart context
    } catch (err) {
      console.error("Error adding to cart:", err);
      // Error notification is handled in the cart context
    }
  };

  // Handle opening quick view
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  // Display loading state
  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-red-700">
              Error Loading Products
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative w-full h-[280px] mb-10 rounded-lg overflow-hidden">
        <Image
          src="/banner-background.jpg"
          alt="Premium Supplements"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center pl-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            PREMIUM SUPPLEMENTS
          </h1>
          <p className="text-xl text-white max-w-xl">
            Fuel your performance with premium quality supplements
          </p>
        </div>
      </div>

      {/* Mobile filter toggle */}
      <div className="md:hidden flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          variant="outline"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-5 w-5" />
          Filters
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div
          className={`md:w-1/4 lg:w-1/5 ${
            mobileFiltersOpen
              ? "block fixed inset-0 z-50 bg-white p-4 overflow-auto"
              : "hidden"
          } md:block md:static md:z-auto md:bg-transparent md:p-0`}
        >
          <div className="bg-white rounded-lg shadow-sm border sticky top-20">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold uppercase">Filters</h2>
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  Clear all
                </button>
                <button
                  className="md:hidden text-gray-500"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium mb-2 uppercase">Search</h3>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  name="search"
                  placeholder="Search products..."
                  defaultValue={filters.search}
                  className="w-full pr-10 border-gray-300"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Categories Filter */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium uppercase">Categories</h3>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <div
                  className={`cursor-pointer hover:text-primary ${
                    filters.category === "" ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => handleFilterChange("category", "")}
                >
                  All Categories
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="ml-2">
                    <div
                      className={`cursor-pointer hover:text-primary flex items-center ${
                        filters.category === category.slug
                          ? "font-medium text-primary"
                          : ""
                      }`}
                      onClick={() =>
                        handleFilterChange("category", category.slug)
                      }
                    >
                      <ChevronRight className="h-4 w-4 mr-1" />
                      {category.name}
                    </div>
                    {category.children && category.children.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1">
                        {category.children.map((child) => (
                          <div
                            key={child.id}
                            className={`cursor-pointer hover:text-primary text-sm ${
                              filters.category === child.slug
                                ? "font-medium text-primary"
                                : ""
                            }`}
                            onClick={() =>
                              handleFilterChange("category", child.slug)
                            }
                          >
                            {child.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium uppercase">Price Range</h3>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="w-full border-gray-300"
                />
                <span>-</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full border-gray-300"
                />
              </div>
            </div>

            {/* Flavors Filter */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium uppercase">Flavor</h3>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <div
                  className={`cursor-pointer hover:text-primary ${
                    filters.flavor === "" ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => handleFilterChange("flavor", "")}
                >
                  All Flavors
                </div>
                {flavors.map((flavor) => (
                  <div
                    key={flavor.id}
                    className={`cursor-pointer hover:text-primary ml-2 flex items-center ${
                      filters.flavor === flavor.id
                        ? "font-medium text-primary"
                        : ""
                    }`}
                    onClick={() => handleFilterChange("flavor", flavor.id)}
                  >
                    {flavor.image && (
                      <div className="w-4 h-4 rounded-full overflow-hidden mr-2">
                        <Image
                          src={flavor.image}
                          alt={flavor.name}
                          width={16}
                          height={16}
                        />
                      </div>
                    )}
                    {flavor.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Weights Filter */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium uppercase">Weight</h3>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <div
                  className={`cursor-pointer hover:text-primary ${
                    filters.weight === "" ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => handleFilterChange("weight", "")}
                >
                  All Weights
                </div>
                {weights.map((weight) => (
                  <div
                    key={weight.id}
                    className={`cursor-pointer hover:text-primary ml-2 ${
                      filters.weight === weight.id
                        ? "font-medium text-primary"
                        : ""
                    }`}
                    onClick={() => handleFilterChange("weight", weight.id)}
                  >
                    {weight.display}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:w-3/4 lg:w-4/5">
          {/* Sort Dropdown */}
          <div className="flex justify-end mb-6">
            <div className="inline-flex items-center border rounded-md overflow-hidden bg-white">
              <span className="px-3 py-2 text-sm">SORT BY</span>
              <select
                id="sort"
                name="sort"
                className="border-l px-3 py-2 focus:outline-none"
                onChange={handleSortChange}
                value={`${filters.sort}-${filters.order}`}
              >
                <option value="newest">Featured</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
                <option value="name-asc">Alphabetically, A-Z</option>
                <option value="name-desc">Alphabetically, Z-A</option>
                <option value="oldest">Date, old to new</option>
                <option value="newest">Date, new to old</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.search ||
            filters.category ||
            filters.flavor ||
            filters.weight ||
            filters.minPrice ||
            filters.maxPrice) && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-50 rounded-md border">
              <span className="text-sm font-medium">Active Filters:</span>

              {filters.search && (
                <div className="bg-primary text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <span>Search: {filters.search}</span>
                  <button
                    onClick={() => handleFilterChange("search", "")}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.category && (
                <div className="bg-primary text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <span>
                    Category:{" "}
                    {categories.find((c) => c.slug === filters.category)
                      ?.name || filters.category}
                  </span>
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.flavor && (
                <div className="bg-primary text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <span>
                    Flavor:{" "}
                    {flavors.find((f) => f.id === filters.flavor)?.name ||
                      filters.flavor}
                  </span>
                  <button
                    onClick={() => handleFilterChange("flavor", "")}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.weight && (
                <div className="bg-primary text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <span>
                    Weight:{" "}
                    {weights.find((w) => w.id === filters.weight)?.display ||
                      filters.weight}
                  </span>
                  <button
                    onClick={() => handleFilterChange("weight", "")}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <div className="bg-primary text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <span>
                    Price: {filters.minPrice || "0"} - {filters.maxPrice || "∞"}
                  </span>
                  <button
                    onClick={() => {
                      handleFilterChange("minPrice", "");
                      handleFilterChange("maxPrice", "");
                    }}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <button
                onClick={clearFilters}
                className="text-xs text-primary underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center border">
              <div className="text-gray-400 mb-4">
                <AlertCircle className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-3">No products found</h2>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search term
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white overflow-hidden transition-all hover:shadow-lg shadow-md rounded-sm group"
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
                      <Image
                        src={product.image || "/product-placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
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
                            handleQuickView(product);
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
                      href={`/products/${product.slug}`}
                      className="hover:text-primary"
                    >
                      <h3 className="font-medium uppercase mb-2 line-clamp-2 text-sm">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-center mb-2">
                      {product.hasSale ? (
                        <div className="flex items-center">
                          <span className="font-bold text-lg text-primary">
                            {formatCurrency(product.basePrice)}
                          </span>
                          <span className="text-gray-500 line-through text-sm ml-2">
                            {formatCurrency(product.regularPrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-lg text-primary">
                          {formatCurrency(product.basePrice)}
                        </span>
                      )}
                    </div>

                    {product.flavors > 1 && (
                      <span className="text-xs text-gray-500 block">
                        {product.flavors} flavors available
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center mt-10 mb-4">
              <div className="inline-flex items-center rounded-md overflow-hidden border divide-x">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-none border-0 hover:bg-gray-100"
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
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 ${
                          pagination.page === page
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }

                  // Show ellipsis for skipped pages
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
                  disabled={pagination.page === pagination.pages}
                  className="rounded-none border-0 hover:bg-gray-100"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Dialog */}
      <ProductQuickView
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
