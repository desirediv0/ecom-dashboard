"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";
import { DynamicIcon } from "@/components/dynamic-icon";
import { fetchApi, formatCurrency } from "@/lib/utils";
import Image from "next/image";

export default function WishlistPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/wishlist");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;

      setLoadingItems(true);
      setError("");

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        setWishlistItems(response.data.wishlistItems || []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setError("Failed to load your wishlist. Please try again later.");
      } finally {
        setLoadingItems(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      await fetchApi(`/users/wishlist/${wishlistItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Remove the item from state
      setWishlistItems((current) =>
        current.filter((item) => item.id !== wishlistItemId)
      );
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Add to cart and remove from wishlist
  const addToCartAndRemove = async (wishlistItemId, productId) => {
    try {
      // Get the first variant for the product
      const productResponse = await fetchApi(`/public/products/${productId}`, {
        credentials: "include",
      });

      const product = productResponse.data.product;

      if (!product || !product.variants || product.variants.length === 0) {
        setError("Product variants not available.");
        return;
      }

      // Use the first variant by default
      const productVariantId = product.variants[0].id;

      // Add to cart
      await fetchApi("/cart/add", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          productVariantId,
          quantity: 1,
        }),
      });

      // Remove from wishlist
      await removeFromWishlist(wishlistItemId);

      // Show success message or notification (optional)
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setError("Failed to add item to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loadingItems ? (
          <div className="bg-white rounded-lg shadow p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <DynamicIcon
              name="Heart"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Save your favorite items to your wishlist for easy access later.
            </p>
            <Link href="/products">
              <Button>Explore Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="relative h-48 bg-gray-100">
                  {item.images && item.images[0] ? (
                    <Image
                      width={96}
                      height={96}
                      src={item.images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <DynamicIcon
                        name="Image"
                        className="h-12 w-12 text-gray-400"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                    aria-label="Remove from wishlist"
                  >
                    <DynamicIcon name="X" className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 my-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="font-semibold">
                      {formatCurrency(item.price)}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                        onClick={() =>
                          addToCartAndRemove(item.id, item.productId)
                        }
                      >
                        <DynamicIcon
                          name="ShoppingCart"
                          className="h-4 w-4 mr-1"
                        />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
