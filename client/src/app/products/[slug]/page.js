import { fetchApi } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

import ProductContent from "./ProductContent";

export async function generateMetadata({ params }) {
  const { slug } = params;
  let title = "Product Details | GenuineNutrition";
  let description =
    "Premium quality fitness supplements with lab-tested ingredients for maximum effectiveness. Free shipping on orders over ₹999.";
  let image = null;

  try {
    // Fetch product details from API
    const response = await fetchApi(`/public/products/${slug}`);
    const product = response.data.product;

    if (product) {
      title = `${product.name} | GenuineNutrition`;
      description =
        product.shortDescription ||
        (product.description
          ? product.description.substring(0, 150) + "..."
          : description);

      // Get the first image from product images
      if (product.images && product.images.length > 0) {
        image = product.images[0].url;
      } else if (product.image) {
        image = product.image;
      }
    }
  } catch (error) {
    console.error("Error fetching product metadata:", error);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: "website",
    },
  };
}

export default function ProductDetailPage({ params }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const renderProductImages = () => {
    if (!product || !product.images || product.images.length === 0) {
      return (
        <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src="/images/product-placeholder.jpg"
            alt={product?.name || "Product"}
            fill
            className="object-contain"
            priority
          />
        </div>
      );
    }

    // If there's only one image, just show it
    if (product.images.length === 1) {
      return (
        <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(product.images[0]?.url)}
            alt={product?.name || "Product"}
            fill
            className="object-contain"
            priority
          />
        </div>
      );
    }

    // If multiple images, display in a grid
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {product.images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden"
            onClick={() => setMainImageIndex(index)}
          >
            <Image
              src={getImageUrl(image.url)}
              alt={`${product.name} - Image ${index + 1}`}
              fill
              className="object-contain"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    );
  };

  return <ProductContent slug={params.slug} />;
}
