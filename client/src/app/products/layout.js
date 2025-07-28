"use client";
import VerticalCategoriesCarousel from "@/components/vertical-catgry";
import { usePathname } from "next/navigation";

export default function ProductsLayout({ children }) {
  const pathname = usePathname();

  // Check if we're on a product detail page (has slug parameter)
  const isProductDetailPage =
    pathname.includes("/products/") && pathname.split("/").length > 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 md:gap-8">
          {/* Left Sidebar - Vertical Categories - Hidden on product detail pages and mobile */}
          {!isProductDetailPage && (
            <div className="flex-shrink-0">
              <div className="sticky top-24">
                <VerticalCategoriesCarousel />
              </div>
            </div>
          )}

          {/* Right Side - Main Content */}
          <div
            className={`${isProductDetailPage ? "w-full" : "flex-1"} min-w-0`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
