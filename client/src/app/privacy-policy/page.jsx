import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <Card>
        <CardContent className="space-y-5 pt-6 text-gray-800">
          <p className="text-lg">
            GenuineNutrition (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;)
            is committed to protecting your privacy. This Privacy Policy
            outlines how your personal information is collected, used, and
            shared when you visit or make a purchase from our website. By using
            our services, you agree to the collection and use of information in
            accordance with this policy.
          </p>

          <h2 className="text-2xl font-semibold pt-4">
            Information We Collect
          </h2>
          <ul className="list-disc ml-6 space-y-3">
            <li>
              <strong>Personal Information:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Name, email address, and contact numbers</li>
                <li>Shipping and billing addresses</li>
                <li>Date of birth and gender (if provided)</li>
                <li>Purchase history and preferences</li>
                <li>Communication preferences</li>
              </ul>
            </li>
            <li>
              <strong>Payment Information:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>
                  Credit/debit card details (processed securely via trusted
                  payment gateways)
                </li>
                <li>UPI information</li>
                <li>Banking details for refunds</li>
                <li>Transaction history</li>
              </ul>
            </li>
            <li>
              <strong>Technical Information:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Time zone and location data</li>
                <li>Cookies and usage data</li>
                <li>Login information and session details</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-3">
            <li>
              <strong>Order Processing and Customer Service:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Provide order updates and tracking information</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Handle returns and refunds</li>
              </ul>
            </li>
            <li>
              <strong>Website Improvement:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Analyze user behavior and preferences</li>
                <li>Optimize website performance and functionality</li>
                <li>Enhance user experience and navigation</li>
                <li>Debug and fix technical issues</li>
              </ul>
            </li>
            <li>
              <strong>Marketing and Communication:</strong>
              <ul className="list-circle ml-6 mt-2 space-y-1">
                <li>Send promotional emails and newsletters (with consent)</li>
                <li>Provide personalized product recommendations</li>
                <li>Conduct market research and surveys</li>
                <li>Notify you about special offers and updates</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Data Security</h2>
          <p className="mb-4">
            We implement robust security measures to protect your personal
            information:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>SSL encryption for all data transmission</li>
            <li>Regular security audits and updates</li>
            <li>Restricted access to personal information</li>
            <li>Secure data storage and backup systems</li>
            <li>Regular staff training on data protection</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Third-Party Services</h2>
          <p className="mb-4">
            We partner with trusted third-party service providers to facilitate
            our operations:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Payment processors for secure transactions</li>
            <li>Shipping and logistics partners</li>
            <li>Analytics and marketing services</li>
            <li>Customer support platforms</li>
            <li>Email service providers</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Your Rights</h2>
          <p className="mb-4">
            You have several rights regarding your personal information:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to request data deletion</li>
            <li>Right to withdraw consent for marketing</li>
            <li>Right to data portability</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">Contact Us</h2>
          <p className="mb-4">
            For any privacy-related queries or to exercise your rights, contact
            us at:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:privacy@genuinenutrition.com"
              className="text-blue-600 underline"
            >
              privacy@genuinenutrition.com
            </a>
            <br />
            Phone: +91 98765 43210
            <br />
            Address: GenuineNutrition, Sector 15, Gurugram, Haryana - 122001
          </p>

          <p className="mt-6 text-sm">Last updated: March 15, 2024</p>
        </CardContent>
      </Card>
    </div>
  );
}
