"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    async function fetchContactInfo() {
      setLoading(true);
      try {
        const response = await fetchApi("/content/contact");
        setContactInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContactInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await fetchApi("/content/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success(response.data.message || "Your message has been sent!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <main className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Have a question or need support? Our team is here to help!
          </p>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact Form - 3 columns */}
            <div className="md:col-span-3 bg-white p-6 md:p-8 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1.5"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1.5"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-1.5"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-1.5"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto px-8 py-2.5"
                  disabled={formLoading}
                >
                  {formLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information - 2 columns */}
            <div className="md:col-span-2">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-32 mb-4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-10 w-32 mt-6 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-bold mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-5">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-gray-600">
                            {contactInfo?.address ||
                              "89/2 Sector 39, Gurugram, Haryana"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-gray-600">
                            {contactInfo?.phone || "+91 8053210008"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-gray-600">
                            {contactInfo?.email ||
                              "support@GenuineNutrition.com"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a
                        href={
                          contactInfo?.socialLinks?.facebook ||
                          "https://facebook.com/GenuineNutrition"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a
                        href={
                          contactInfo?.socialLinks?.instagram ||
                          "https://instagram.com/GenuineNutrition"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href={
                          contactInfo?.socialLinks?.twitter ||
                          "https://twitter.com/GenuineNutrition"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="mt-12">
            <div className="bg-gray-50 rounded-lg overflow-hidden h-[400px] mb-4">
              <iframe
                src={`https://maps.google.com/maps?q=${28.4423},${77.0493}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                title="GenuineNutrition Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p className="text-center text-gray-600">
              Visit our store at{" "}
              {contactInfo?.address || "89/2 Sector 39, Gurugram, Haryana"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
