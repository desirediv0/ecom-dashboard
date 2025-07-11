import { Card, CardContent } from "@/components/ui/card";

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
      <Card>
        <CardContent className="space-y-5 pt-6 text-gray-800">
          <p className="text-lg">
            At GenuineNutrition, we strive to deliver your orders quickly and
            safely. This shipping policy outlines our delivery processes,
            timelines, and charges to ensure a smooth delivery experience for
            all our customers.
          </p>

          <h2 className="text-2xl font-semibold pt-4">Delivery Areas</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Domestic Shipping:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>All major cities across India</li>
                <li>Tier 2 and Tier 3 cities</li>
                <li>Remote locations (additional delivery time)</li>
              </ul>
            </li>
            <li>
              <strong>Currently Not Serving:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>International locations</li>
                <li>Restricted zones as per government regulations</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Delivery Timeframes</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Metro Cities:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Standard Delivery: 2-3 business days</li>
                <li>Express Delivery: Next business day</li>
              </ul>
            </li>
            <li>
              <strong>Other Cities:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Standard Delivery: 3-5 business days</li>
                <li>Express Delivery: 2-3 business days</li>
              </ul>
            </li>
            <li>
              <strong>Remote Areas:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Standard Delivery: 5-7 business days</li>
                <li>Express Delivery not available</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Shipping Charges</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Free Shipping:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Orders above ₹999 (Standard Delivery)</li>
                <li>Premium membership orders</li>
                <li>Special promotion orders</li>
              </ul>
            </li>
            <li>
              <strong>Standard Shipping:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Orders below ₹999: ₹49</li>
                <li>Remote areas: Additional ₹30</li>
              </ul>
            </li>
            <li>
              <strong>Express Shipping:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Metro cities: ₹99</li>
                <li>Other cities: ₹149</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Order Tracking</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Tracking Methods:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Email updates at each delivery stage</li>
                <li>SMS notifications</li>
                <li>Online tracking through your account</li>
                <li>WhatsApp updates (if opted)</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Delivery Guidelines</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Address Requirements:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Complete address with landmarks</li>
                <li>Valid pin code</li>
                <li>Active contact number</li>
                <li>Alternate contact (recommended)</li>
              </ul>
            </li>
            <li>
              <strong>Delivery Attempts:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Three delivery attempts will be made</li>
                <li>Order returns to warehouse after failed attempts</li>
                <li>Redelivery charges may apply</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Special Instructions</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Add delivery instructions during checkout</li>
            <li>Specify preferred delivery time</li>
            <li>Mention safe delivery location</li>
            <li>Request call before delivery</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Contact Information</h2>
          <p className="mb-4">
            For any shipping-related queries, please contact our logistics team:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:shipping@genuinenutrition.com"
              className="text-blue-600 underline"
            >
              shipping@genuinenutrition.com
            </a>
            <br />
            Phone: +91 98765 43210 (10 AM - 6 PM, Mon-Sat)
            <br />
            WhatsApp: +91 98765 43210
          </p>

          <p className="mt-6 text-sm">
            Last updated: March 15, 2024. Delivery times may vary during
            holidays and peak seasons. Please check product page for specific
            delivery information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
