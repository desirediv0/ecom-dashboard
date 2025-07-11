import { Card, CardContent } from "@/components/ui/card";

export default function TermsConditions() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <Card>
        <CardContent className="space-y-5 pt-6 text-gray-800">
          <p className="text-lg">
            Welcome to GenuineNutrition. These Terms & Conditions govern your
            use of our website and services. By accessing or using our website,
            you agree to be bound by these terms. Please read them carefully
            before proceeding with any purchase or registration.
          </p>

          <h2 className="text-2xl font-semibold pt-4">Definitions</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              &quot;Website&quot; refers to GenuineNutrition&apos;s online
              platform
            </li>
            <li>
              &quot;User,&quot; &quot;You,&quot; &quot;Your&quot; refers to
              website visitors and customers
            </li>
            <li>
              &quot;We,&quot; &quot;Us,&quot; &quot;Our&quot; refers to
              GenuineNutrition
            </li>
            <li>
              &quot;Products&quot; refers to items available for purchase on our
              website
            </li>
            <li>
              &quot;Services&quot; refers to all services provided through our
              website
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Account Registration</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Registration Requirements:
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Must be at least 18 years old</li>
                <li>Provide accurate and complete information</li>
                <li>Keep login credentials confidential</li>
                <li>Update information when necessary</li>
              </ul>
            </li>
            <li>
              Account Security:
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Responsible for all activities under your account</li>
                <li>Notify us immediately of unauthorized access</li>
                <li>Use strong passwords and change them regularly</li>
                <li>Don&apos;t share account access with others</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Product Information</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Product Availability:
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Products subject to availability</li>
                <li>Right to discontinue products without notice</li>
                <li>Stock information updated regularly but not real-time</li>
                <li>Quantity restrictions may apply</li>
              </ul>
            </li>
            <li>
              Product Description:
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Images are representative</li>
                <li>Specifications subject to change</li>
                <li>Colors may vary due to display settings</li>
                <li>Weight and dimensions are approximate</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Pricing and Payment</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>All prices are in Indian Rupees (INR)</li>
            <li>Prices include GST unless stated otherwise</li>
            <li>We reserve the right to modify prices without notice</li>
            <li>Payment must be made in full before order processing</li>
            <li>
              Accepted Payment Methods:
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Credit/Debit Cards</li>
                <li>UPI</li>
                <li>Net Banking</li>
                <li>Digital Wallets</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Shipping and Delivery</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Delivery timeframes are estimates only</li>
            <li>Shipping charges calculated at checkout</li>
            <li>Order tracking provided when available</li>
            <li>Delivery to registered address only</li>
            <li>Customer responsible for correct address details</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Intellectual Property</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>All content is our intellectual property</li>
            <li>No reproduction without written permission</li>
            <li>Trademarks and logos are protected</li>
            <li>User content remains user&apos;s property</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">
            Limitation of Liability
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Not liable for indirect or consequential damages</li>
            <li>Maximum liability limited to purchase amount</li>
            <li>No warranty for website availability</li>
            <li>Not responsible for third-party links</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Dispute Resolution</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Disputes resolved through negotiation first</li>
            <li>Mandatory mediation before legal action</li>
            <li>Jurisdiction: Courts of Gurugram, Haryana</li>
            <li>Indian law governs these terms</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Termination</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>We may terminate accounts for violations</li>
            <li>Users may terminate account any time</li>
            <li>Obligations survive termination</li>
            <li>Refund policy applies to pending orders</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Contact Information</h2>
          <p className="mb-4">
            For any questions regarding these terms, please contact us at:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:legal@genuinenutrition.com"
              className="text-blue-600 underline"
            >
              legal@genuinenutrition.com
            </a>
            <br />
            Phone: +91 98765 43210
            <br />
            Address: GenuineNutrition Legal Dept., Sector 15, Gurugram, Haryana
            - 122001
          </p>

          <p className="mt-6 text-sm">
            Last updated: March 15, 2024. We reserve the right to modify these
            terms at any time without prior notice. Regular review is
            recommended.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
