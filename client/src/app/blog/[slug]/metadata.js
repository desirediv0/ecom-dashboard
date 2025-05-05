import { fetchApi } from "@/lib/utils";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/images/blog-placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  let title = "Blog | EcomSupplements";
  let description =
    "Read our latest articles about fitness, supplements, and nutrition tips.";
  let ogImage = "/images/blog-placeholder.jpg";

  try {
    // Fetch blog post details from API
    const response = await fetchApi(`/content/blog/${slug}`);
    const post = response.data.post;

    if (post) {
      // Set metadata from post data
      title = `${post.title} | EcomSupplements`;
      description =
        post.summary ||
        (post.content
          ? post.content.substring(0, 160).replace(/<[^>]*>/g, "")
          : description);

      // Set OG image if post has cover image
      if (post.coverImage) {
        ogImage = getImageUrl(post.coverImage);
      }
    }
  } catch (error) {
    console.error("Error fetching blog post metadata:", error);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
