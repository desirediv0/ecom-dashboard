import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Headtext from "@/components/ui/headtext";
import { fetchApi } from "@/lib/utils";
import Image from "next/image";

export default function BrandCarousel({ tag, title }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await fetchApi(`/public/brands-by-tag?tag=${tag}`);
        setBrands(res.data.brands || []);
        setError(null);
      } catch (err) {
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [tag]);

  if (loading) {
    return <div className="py-8 text-center">Loading {title}...</div>;
  }
  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-4">
          <Headtext text={title} />
        </div>
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {brands.map((brand) => (
              <CarouselItem
                key={brand.id}
                className="basis-1/2 md:basis-1/4 lg:basis-1/5 p-4"
              >
                <Link
                  href={`/brand/${brand.slug}`}
                  className="block group text-center"
                >
                  <div className="relative h-32 w-32 mx-auto mb-2 bg-white rounded-lg border flex items-center justify-center shadow p-2">
                    <Image
                      width={100}
                      height={100}
                      src={
                        brand.image?.startsWith("http")
                          ? brand.image
                          : `https://desirediv-storage.blr1.digitaloceanspaces.com/${brand.image}`
                      }
                      alt={brand.name}
                      className="object-contain h-28 w-28 md:h-32 md:w-32 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="font-medium text-sm mt-2 group-hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                    {brand.name}
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 md:-left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white border-gray-200 text-gray-700 shadow-lg hover:text-gray-800" />
          <CarouselNext className="-right-1 md:right-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white border-gray-200 text-gray-700 shadow-lg hover:text-gray-800" />
        </Carousel>
      </div>
    </section>
  );
}
