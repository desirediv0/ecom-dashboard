import { Card, CardContent } from "@/components/ui/card";

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Cancellation & Refund Policy</h1>
      <Card>
        <CardContent className="space-y-5 pt-6 text-gray-800">
          <p className="text-lg">
            At GenuineNutrition, customer satisfaction is our top priority. We
            understand that sometimes you may need to cancel an order or return
            a product. This policy outlines our procedures for cancellations,
            returns, and refunds to ensure a smooth experience for our valued
            customers.
          </p>

          <h2 className="text-2xl font-semibold pt-4">Order Cancellation</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">
            Cancellation Timeline
          </h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Orders can be cancelled within <strong>2 hours</strong> of placing
              them
            </li>
            <li>
              Cancellation requests after 2 hours may be considered based on
              order status
            </li>
            <li>Orders that have been shipped cannot be cancelled</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">How to Cancel</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Log in to your account and visit the Order History section</li>
            <li>
              Click on the &quot;Cancel Order&quot; button next to the relevant
              order
            </li>
            <li>
              Alternatively, contact our customer service:
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@genuinenutrition.com"
                    className="text-blue-600 underline"
                  >
                    support@genuinenutrition.com
                  </a>
                </li>
                <li>Phone: +91 98765 43210 (10 AM - 7 PM, Mon-Sat)</li>
                <li>WhatsApp: +91 98765 43210</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Returns Policy</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">Return Eligibility</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Products eligible for return:
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Damaged or defective products</li>
                <li>Expired products</li>
                <li>Wrong products delivered</li>
                <li>Products not matching the description</li>
              </ul>
            </li>
            <li>
              Return request must be raised within <strong>48 hours</strong> of
              delivery
            </li>
            <li>
              Product Condition Requirements:
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Must be unused and unopened</li>
                <li>Original packaging must be intact</li>
                <li>All labels and tags must be attached</li>
                <li>Include all accessories and free items received</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Refund Process</h2>
          <ul className="list-disc ml-6 space-y-3">
            <li>
              <strong>Inspection Period:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Returns are inspected within 24-48 hours of receipt</li>
                <li>You will be notified of the inspection result via email</li>
                <li>Approved returns are processed for refund immediately</li>
              </ul>
            </li>
            <li>
              <strong>Refund Timeline:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Credit/Debit Cards: 5-7 working days</li>
                <li>UPI/Net Banking: 2-3 working days</li>
                <li>Store Credit: Immediate</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Non-Returnable Items</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Products marked as &quot;Non-Returnable&quot; on the product page
            </li>
            <li>Products purchased during clearance sales</li>
            <li>Products with removed or damaged safety seals</li>
            <li>Customized or personalized products</li>
            <li>Products damaged due to misuse or mishandling</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Shipping Costs</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Return shipping costs are borne by the customer</li>
            <li>Original shipping charges are non-refundable</li>
            <li>Free return shipping for damaged or wrong products</li>
            <li>Use our authorized courier partners for returns</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Contact Information</h2>
          <p className="mb-4">
            For any queries regarding returns or refunds, please contact our
            customer support:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:returns@genuinenutrition.com"
              className="text-blue-600 underline"
            >
              returns@genuinenutrition.com
            </a>
            <br />
            Phone: +91 98765 43210
            <br />
            Address: GenuineNutrition Returns Dept., Sector 15, Gurugram,
            Haryana - 122001
          </p>

          <p className="mt-6 text-sm">Last updated: March 15, 2024</p>
        </CardContent>
      </Card>
    </div>
  );
}
