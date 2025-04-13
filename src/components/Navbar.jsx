import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useResponsive } from "./Responsive";
import Cookies from "js-cookie";
import logo from "../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  const userType = Cookies.get("userType");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile && !isOpen) {
        setIsScrolled(window.scrollY > 20);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, isMobile]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    // Clear all cookies
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    // Navigate to landing page
    navigate("/");
  };

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/players", label: "Players" },
    { path: "/teams", label: "Teams" },
    { path: "/matches", label: "Matches" },
    { path: "/analytics", label: "Analytics" },
    // Show Admin link only for high privilege users
    ...(userType === "high" ? [{ path: "/admin", label: "Admin" }] : []),
    // Replace Scores with Logout
    { path: "#", label: "Logout", onClick: handleLogout },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="relative w-full">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-opacity-90" : "bg-opacity-100"
        } bg-miniaccent backdrop-blur-sm shadow-lg`}
      >
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="LFC Logo"
                  className={`${
                    isMobile ? "h-8 w-8" : "h-10 w-10"
                  } rounded-full`}
                />
                <span
                  className={`font-bold text-white ${
                    isMobile ? "text-xl" : "text-2xl"
                  } ${isTablet ? "hidden" : "block"}`}
                >
                  LFC
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex md:items-center md:justify-center md:flex-1 md:space-x-4 lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={link.onClick}
                  className={`px-3 py-2 rounded-md ${
                    isMobile ? "text-xs" : isTablet ? "text-sm" : "text-base"
                  } transition-colors duration-200 ${
                    isActivePath(link.path)
                      ? "text-blackbc font-bold"
                      : "text-white hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded={isOpen}
              >
                <span className="sr-only">
                  {isOpen ? "Close menu" : "Open menu"}
                </span>
                {isOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - Full Width */}
        <div
          className={`${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden fixed inset-0 z-40 w-screen h-screen bg-dark transform transition-transform duration-300 ease-in-out`}
        >
          <div className="pt-16 pb-3 space-y-1 px-4 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                  setIsOpen(false);
                }}
                className={`block w-full px-3 py-2 rounded-md text-base font-medium ${
                  isActivePath(link.path)
                    ? "bg-midnight text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <div className="h-16 w-full"></div>
    </div>
  );
}

export default Navbar;
