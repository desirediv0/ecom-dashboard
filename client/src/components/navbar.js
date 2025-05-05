"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Heart,
  ChevronDown,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { ClientOnly } from "./client-only";
import Image from "next/image";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchExpanded(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Handle click outside of navbar to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchApi("/public/categories");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Mobile menu with ClientOnly to prevent hydration issues
  const MobileMenu = ({
    isMenuOpen,
    setIsMenuOpen,
    categories,
    searchQuery,
    setSearchQuery,
    handleSearch,
    isAuthenticated,
    user,
    cart,
    handleLogout,
  }) => {
    if (!isMenuOpen) return null;

    return (
      <div
        className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center px-4 py-3 z-10">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-xl font-bold text-gray-900 flex items-center">
                <span className="text-primary">Ecom</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
            <form onSubmit={handleSearch} className="relative mb-6">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pr-10 py-2 border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label="Search"
              >
                <Search className="h-4 w-4 text-primary" />
              </button>
            </form>

            <div className="border-b pb-2 mb-4">
              <Link
                href="/products"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-bold text-lg mb-3">Categories</h3>
              <div className="space-y-3 pl-2">
                {categories.map((category) => (
                  <div key={category.id} className="py-1">
                    <Link
                      href={`/category/${category.slug}`}
                      className="block hover:text-primary text-base transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b pb-4 mb-4">
              <Link
                href="/blog"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </div>

            <div className="border-b pb-4 mb-4">
              <Link
                href="/about"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </div>

            <div className="border-b pb-4 mb-4">
              <Link
                href="/shipping"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shipping Policy
              </Link>
            </div>

            <div className="border-b pb-4 mb-4">
              <Link
                href="/contact"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="border-b pb-4 mb-4">
                <h3 className="font-bold text-lg mb-3">My Account</h3>
                <div className="space-y-3 pl-2">
                  <Link
                    href="/account"
                    className="block py-1.5 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block py-1.5 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block py-1.5 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-1.5 text-red-600 hover:text-red-800 w-full text-left transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 mt-6">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full py-6 text-base">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full py-6 text-base">Register</Button>
                </Link>
              </div>
            )}

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-medium">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">Store Locator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" ref={navbarRef}>
      {/* Top bar */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-2 md:py-1.5 text-center text-xs md:text-sm font-medium">
        Free shipping on orders over ₹999 | Use code FIT10 for 10% off your
        first order
      </div>

      {/* Contact info bar - Desktop only */}
      <div className="hidden md:block bg-gray-100 py-1.5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-xs text-gray-700">
                <Phone className="h-3.5 w-3.5 mr-1.5" />
                <span>+91 98765 43210</span>
              </div>
              <Link
                href="/store-locator"
                className="flex items-center text-xs text-gray-700 hover:text-primary transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                <span>Store Locator</span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-4 text-xs">
              <Link
                href="/shipping"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Shipping
              </Link>
              <Link
                href="/faqs"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                FAQs
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Menu toggle for mobile */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-primary">Ecom</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/products"
                className="font-medium text-gray-700 hover:text-primary transition-colors"
              >
                All Products
              </Link>

              {/* Categories dropdown */}
              <div className="relative">
                <button
                  className={`font-medium ${
                    activeDropdown === "categories"
                      ? "text-primary"
                      : "text-gray-700"
                  } hover:text-primary transition-colors flex items-center focus:outline-none`}
                  onClick={() => toggleDropdown("categories")}
                  aria-expanded={activeDropdown === "categories"}
                >
                  Categories
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === "categories" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md py-2 border border-gray-100 z-50 transition-all duration-200 origin-top ${
                    activeDropdown === "categories"
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {categories.map((category) => (
                    <div key={category.id}>
                      <Link
                        href={`/category/${category.slug}`}
                        className="block px-4 py-2.5 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {category.name}
                      </Link>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <Link
                      href="/products"
                      className="block px-4 py-2.5 text-primary font-medium hover:bg-primary/5 transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      View All Categories
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/blog"
                className="font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Blog
              </Link>

              <Link
                href="/about"
                className="font-medium text-gray-700 hover:text-primary transition-colors"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className="font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Search, Cart, Account */}
            <div className="flex items-center space-x-1 md:space-x-4">
              {/* Search button/form */}
              <div className="relative">
                {isSearchExpanded ? (
                  <form
                    onSubmit={handleSearch}
                    className="absolute right-0 top-0 z-20 flex"
                  >
                    <Input
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search products..."
                      className="w-[200px] md:w-[300px] pr-10 border-primary focus:ring-primary focus:border-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      aria-label="Search"
                    >
                      <Search className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      type="button"
                      className="absolute right-[calc(100%+4px)] top-1/2 transform -translate-y-1/2 p-1.5 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none"
                      aria-label="Close search"
                      onClick={() => setIsSearchExpanded(false)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Wishlist - Desktop Only */}
              <Link
                href="/wishlist"
                className="hidden md:block p-2 text-gray-600 hover:text-primary transition-colors relative"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 text-gray-600 hover:text-primary transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart && cart.items?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>

              {/* Account - desktop */}
              <div className="hidden md:block relative">
                <button
                  className={`p-2 ${
                    activeDropdown === "account"
                      ? "text-primary"
                      : "text-gray-600"
                  } hover:text-primary transition-colors flex items-center focus:outline-none`}
                  onClick={() => toggleDropdown("account")}
                  aria-expanded={activeDropdown === "account"}
                >
                  <User className="h-5 w-5" />
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === "account" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md py-2 border border-gray-100 z-50 transition-all duration-200 origin-top ${
                    activeDropdown === "account"
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 mb-2">
                        <p className="font-medium">
                          Hi, {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        My Wishlist
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setActiveDropdown(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3">
                        <Link
                          href="/login"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <Button className="w-full mb-2">Login</Button>
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <Button variant="outline" className="w-full">
                            Register
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ClientOnly>
        <MobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isAuthenticated={isAuthenticated}
          user={user}
          cart={cart}
          handleLogout={handleLogout}
        />
      </ClientOnly>
    </header>
  );
}
