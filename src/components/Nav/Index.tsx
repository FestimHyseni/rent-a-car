// components/Nav/Nav.tsx (or your actual path)
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  LogIn,
  LogOut,
  UserCircle,
  ChevronDown,
  PlusCircle,
} from "lucide-react"; // Example icons

const Nav = () => {
  const { data: session, status } = useSession();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle navigation link clicks to close dropdown if open (optional)
  const handleNavLinkClick = () => {
    setIsUserDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 right-0 z-50 bg-[#0e1a2b]/80 backdrop-blur-md py-3 px-6 flex items-center justify-between shadow-lg text-white">
      <Link
        href="/"
        className="text-2xl font-bold text-green-500 hover:text-green-400 transition-colors"
        onClick={handleNavLinkClick}
      >
        Carento
      </Link>
      <ul className="hidden md:flex items-center gap-5 text-sm">
        <li>
          <Link
            href="/"
            className="hover:text-green-400 transition-colors"
            onClick={handleNavLinkClick}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className="hover:text-green-400 transition-colors"
            onClick={handleNavLinkClick}
          >
            Search
          </Link>
        </li>
        {/* Assuming Dealers, Shop, Pages are actual routes */}
        <li>
          <Link
            href="/brands"
            className="hover:text-green-400 transition-colors"
            onClick={handleNavLinkClick}
          >
            Brands
          </Link>
        </li>
        <li>
          <Link
            href="/shop"
            className="hover:text-green-400 transition-colors"
            onClick={handleNavLinkClick}
          >
            Shop
          </Link>
        </li>
        {/* <li><Link href="/Pages" className="hover:text-green-400 transition-colors" onClick={handleNavLinkClick}>Pages</Link></li> */}
        <li>
          <Link
            href="/about"
            className="hover:text-green-400 transition-colors"
            onClick={handleNavLinkClick}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="hover:text-green-400 transition-colors"
            onClick={handleNavLinkClick}
          >
            Contact
          </Link>
        </li>
      </ul>
      <div className="flex gap-4 items-center">
        {/* Add Listing Button - Kept as is, but you might want to make it conditional on login */}
        <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md shadow-sm transition-colors flex items-center gap-2">
          <PlusCircle size={16} /> Add Listing
        </button>

        {/* Auth Section */}
        <div className="flex items-center">
          {status === "loading" && (
            <div className="animate-pulse flex items-center space-x-2">
              <div className="bg-slate-700/50 h-8 w-20 rounded-md"></div>
            </div>
          )}

          {status === "unauthenticated" && (
            <button
              onClick={() => signIn()} // Redirects to your /login page defined in NextAuth config
              className="text-sm hover:text-green-400 transition-colors flex items-center gap-1"
            >
              <LogIn size={16} />
              Sign In
            </button>
          )}

          {status === "authenticated" && session?.user && (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-1 hover:bg-slate-700/50 p-2 rounded-lg focus:outline-none transition-colors"
                aria-expanded={isUserDropdownOpen}
                aria-haspopup="true"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User avatar"}
                    className="w-7 h-7 rounded-full border-2 border-slate-600 object-cover"
                  />
                ) : (
                  <UserCircle size={22} className="text-slate-400" />
                )}
                <span className="hidden sm:inline text-sm font-medium">
                  {session.user.name?.split(" ")[0] || session.user.email}{" "}
                  {/* Show first name or email */}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isUserDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-50 py-1 ring-1 ring-black ring-opacity-5 origin-top-right">
                  <div className="px-4 py-3">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p
                      className="text-sm font-medium text-slate-900 truncate"
                      title={session.user.email || ""}
                    >
                      {session.user.name || session.user.email}
                    </p>
                  </div>
                  <div className="border-t border-slate-200"></div>
                  <Link
                    href="/profile" // Example: user profile page
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 w-full text-left"
                    onClick={handleNavLinkClick}
                  >
                    Your Profile
                  </Link>
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 w-full text-left"
                      onClick={handleNavLinkClick}
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="border-t border-slate-200"></div>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
