"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShippingPolicyPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShippingPolicy() {
      setLoading(true);
      try {
        const response = await fetchApi("/content/shipping");
        setContent(response.data);
      } catch (error) {
        console.error("Failed to fetch shipping policy:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchShippingPolicy();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-1/2 mx-auto mb-6" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4 mb-10" />
          <Skeleton className="h-6 w-1/3 mb-3" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-6" />
          <Skeleton className="h-6 w-1/3 mb-3" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-4/6 mb-6" />
        </div>
      </div>
    );
  }

  return (
    <main className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Shipping Policy
          </h1>

          {/* Render dynamic content if available */}
          {content && content.content ? (
            <div
              className="prose prose-lg max-w-none mx-auto"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          ) : (
            <div className="prose prose-lg max-w-none mx-auto">
              <section className="mb-10">
                <h2>Delivery Information</h2>
                <p>
                  At EcomSupplements, we strive to deliver your orders as
                  quickly and efficiently as possible. We understand that when
                  you order nutritional supplements, you want them right away.
                  That&apos;s why we&apos;ve partnered with reliable courier
                  services to ensure your products reach you in perfect
                  condition.
                </p>
              </section>

              <section className="mb-10">
                <h2>Delivery Timeframes</h2>
                <p>
                  We process all orders within 24 hours of receiving them
                  (excluding weekends and holidays). The estimated delivery
                  times are as follows:
                </p>
                <ul>
                  <li>
                    <strong>
                      Metro Cities (Delhi, Mumbai, Bangalore, Chennai,
                      Hyderabad, Kolkata):
                    </strong>{" "}
                    1-3 business days
                  </li>
                  <li>
                    <strong>Tier 2 Cities:</strong> 2-4 business days
                  </li>
                  <li>
                    <strong>Other regions:</strong> 3-5 business days
                  </li>
                  <li>
                    <strong>Remote areas:</strong> 5-7 business days
                  </li>
                </ul>
                <p>
                  Please note that these are estimated delivery timeframes and
                  may vary depending on your location and other external
                  factors.
                </p>
              </section>

              <section className="mb-10">
                <h2>Shipping Fees</h2>
                <p>We offer the following shipping options:</p>
                <ul>
                  <li>
                    <strong>Free Shipping:</strong> On all orders above ₹999
                  </li>
                  <li>
                    <strong>Standard Shipping:</strong> ₹99 for orders below
                    ₹999
                  </li>
                  <li>
                    <strong>Express Shipping:</strong> ₹199 (delivery within
                    24-48 hours in select metro cities)
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <h2>Order Tracking</h2>
                <p>
                  Once your order is shipped, you will receive a confirmation
                  email with your tracking information. You can track your order
                  by:
                </p>
                <ol>
                  <li>
                    Logging into your account and viewing your order history
                  </li>
                  <li>
                    Using the tracking link provided in your shipping
                    confirmation email
                  </li>
                  <li>
                    Contacting our customer support team with your order number
                  </li>
                </ol>
              </section>

              <section className="mb-10">
                <h2>International Shipping</h2>
                <p>
                  Currently, we only ship within India. We are working to expand
                  our shipping capabilities to other countries in the near
                  future.
                </p>
              </section>

              <section className="mb-10">
                <h2>Shipping Restrictions</h2>
                <p>
                  Some products may have shipping restrictions to certain areas
                  due to local regulations. If your order contains such
                  products, our customer service team will contact you to
                  discuss alternative options.
                </p>
              </section>

              <section>
                <h2>Lost or Damaged Packages</h2>
                <p>
                  If your package is lost or damaged during transit, please
                  contact our customer support team within 48 hours of the
                  estimated delivery date. We will work with the courier service
                  to locate your package or arrange for a replacement to be sent
                  to you.
                </p>
                <p>
                  For any other shipping-related queries, please contact our
                  customer support team at support@ecomsupplements.com or call
                  us at +91 98765 43210.
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
