import React from "react";
import { Shield, Star, Truck, Package } from "lucide-react";
import { card1, card2, card3 } from "@/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SupplementStoreUI = () => {
  const router = useRouter();

  const trustBadges = [
    {
      icon: Shield,
      title: "100% Original",
      color: "text-orange-500",
    },
    {
      icon: Star,
      title: "Certified by Brands",
      color: "text-orange-500",
    },
    {
      icon: Truck,
      title: "Direct Sourcing",
      color: "text-orange-500",
    },
    {
      icon: Package,
      title: "Secure Packaging",
      color: "text-orange-500",
    },
  ];

  const productCards = [
    {
      id: 1,
      image: card3,
      link: "/category/whey-protein",
    },
    {
      id: 2,
      image: card2,
      link: "/category/pre-workout",
    },
    {
      id: 3,
      image: card3,
      link: "/category/protein",
    },
  ];

  const handleCardClick = (link) => {
    router.push(link);
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white">
      {/* Trust Badges Section */}
      <div className="bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-3"
              >
                <div
                  className={`p-3 rounded-full bg-orange-100 ${badge.color}`}
                >
                  <badge.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {badge.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Cards Section */}
      <div className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {productCards.map((card) => (
              <div
                key={card.id}
                className="cursor-pointer transform  transition-all duration-300 overflow-hidden"
                onClick={() => handleCardClick(card.link)}
              >
                <Image
                  width={500}
                  height={500}
                  src={card.image}
                  alt="Product Promotion"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementStoreUI;
