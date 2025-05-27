"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/images/blog-placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

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
          case "price-low":
            sort = "price";
            order = "asc";
            break;
          case "price-high":
            sort = "price";
            order = "desc";
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
    <div className="container mx-auto px-4 py-8">
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
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white overflow-hidden transition-all hover:shadow-lg shadow-md rounded-sm group"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
                  <Image
                    src={
                      product.images[0]?.url
                        ? getImageUrl(product.images[0].url)
                        : "/product-placeholder.jpg"
                    }
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.variants[0]?.salePrice && (
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
                          i < Math.round(product._count?.reviews / 2 || 0)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    ({product._count?.reviews || 0})
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
                  {product.variants[0]?.salePrice ? (
                    <div className="flex items-center">
                      <span className="font-bold text-lg text-primary">
                        {formatCurrency(product.variants[0]?.salePrice)}
                      </span>
                      <span className="text-gray-500 line-through text-sm ml-2">
                        {formatCurrency(product.variants[0]?.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(
                        product.basePrice || product.variants[0]?.price || 0
                      )}
                    </span>
                  )}
                </div>

                {product.flavors > 1 && (
                  <span className="text-xs text-gray-500 block">
                    {product.flavors} variants
                  </span>
                )}
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
    </div>
  );
}
