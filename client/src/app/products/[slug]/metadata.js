import { fetchApi } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { slug } = params;
  let title = "Product Details | EcomSupplements";
  let description =
    "Premium quality fitness supplements with lab-tested ingredients for maximum effectiveness. Free shipping on orders over ₹999.";

  try {
    // Fetch product details from API
    const response = await fetchApi(`/public/products/${slug}`);
    const product = response.data.product;

    if (product) {
      title = `${product.name} | EcomSupplements`;
      description =
        product.shortDescription ||
        (product.description
          ? product.description.substring(0, 150) + "..."
          : description);
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
      type: "product",
    },
  };
}
