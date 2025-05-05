"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  CreditCard,
  Truck,
  Award,
  Heart,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would call an API to subscribe the user
      console.log("Subscribing email:", email);
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-900">
      {/* Features strip */}
      <div className="bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="flex flex-col items-center text-center">
              <Truck className="h-8 w-8 mb-3 text-primary" />
              <span className="text-sm">Free Shipping</span>
              <span className="text-xs text-gray-400">On orders over ₹999</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Award className="h-8 w-8 mb-3 text-primary" />
              <span className="text-sm">100% Authentic</span>
              <span className="text-xs text-gray-400">Lab-tested products</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <CreditCard className="h-8 w-8 mb-3 text-primary" />
              <span className="text-sm">Secure Payments</span>
              <span className="text-xs text-gray-400">Multiple options</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Heart className="h-8 w-8 mb-3 text-primary" />
              <span className="text-sm">Customer Love</span>
              <span className="text-xs text-gray-400">
                Rated 4.8/5 by users
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1 - About */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold text-white flex items-center">
                  <span className="text-primary">Ecom</span>Supplements
                </span>
              </Link>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Your trusted source for premium quality fitness supplements. We
              offer a wide range of lab-tested products designed to help you
              achieve your fitness and wellness goals effectively.
            </p>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-primary text-white p-2.5 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-primary text-white p-2.5 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-primary text-white p-2.5 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-primary text-white p-2.5 rounded-full transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Fitness Street, Wellness City,
                  <br />
                  Mumbai, Maharashtra, 400001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-400 text-sm">
                  info@ecomsupplements.com
                </span>
              </div>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 pb-2 border-b border-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/category/protein"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Protein
                </Link>
              </li>
              <li>
                <Link
                  href="/category/pre-workout"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Pre-Workout
                </Link>
              </li>
              <li>
                <Link
                  href="/category/vitamins"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Vitamins & Minerals
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 pb-2 border-b border-gray-800">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-primary text-sm flex items-center"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 pb-2 border-b border-gray-800">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest products, fitness tips,
              and exclusive offers.
            </p>

            {subscribed ? (
              <div className="bg-primary/10 p-4 rounded">
                <p className="text-primary text-sm font-medium">
                  Thank you for subscribing! Check your email for a special
                  discount code.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white py-6 pl-4 pr-12 text-sm"
                    required
                  />
                  <Button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3"
                  >
                    Join
                  </Button>
                </div>
                <p className="text-gray-500 text-xs">
                  By subscribing you agree to receive marketing communications
                  from us.
                </p>
              </form>
            )}

            <div className="mt-6">
              <h4 className="text-white text-base font-medium mb-3">
                Payment Methods
              </h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-800 p-1.5 rounded">
                  <div className="text-white h-6 w-12 flex items-center justify-center">
                    <span className="text-xs font-medium">VISA</span>
                  </div>
                </div>
                <div className="bg-gray-800 p-1.5 rounded">
                  <div className="text-white h-6 w-12 flex items-center justify-center">
                    <span className="text-xs font-medium">MC</span>
                  </div>
                </div>
                <div className="bg-gray-800 p-1.5 rounded">
                  <div className="text-white h-6 w-12 flex items-center justify-center">
                    <span className="text-xs font-medium">PAYPAL</span>
                  </div>
                </div>
                <div className="bg-gray-800 p-1.5 rounded">
                  <div className="text-white h-6 w-12 flex items-center justify-center">
                    <span className="text-xs font-medium">UPI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} EcomSupplements. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              <span>Made with ❤️ in India</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
