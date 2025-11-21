"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-yellow-500/20 transition-all duration-300 bg-nav">
      <div className="px-4">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group mr-8">
            <div className="relative">
              <Image 
                src="/crownlogo2.png" 
                alt="Crown Majestic Logo" 
                width={180} 
                height={120}
                className="relative z-10 object-contain transition-all duration-300 group-hover:scale-110 logo-image"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/truck" className={`px-4 py-2 transition-colors font-medium relative group ${pathname === '/truck' ? 'text-yellow-500' : 'nav-link'}`}>
              <span className="relative z-10">Find Our Truck</span>
              <div className="absolute inset-0 bg-yellow-500/10 scale-0 group-hover:scale-100 transition-transform rounded-lg"></div>
              {pathname === '/truck' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
              )}
            </Link>
            <Link href="/menu" className={`px-4 py-2 transition-colors font-medium relative group ${pathname === '/menu' ? 'text-yellow-500' : 'nav-link'}`}>
              <span className="relative z-10">Menu</span>
              <div className="absolute inset-0 bg-yellow-500/10 scale-0 group-hover:scale-100 transition-transform rounded-lg"></div>
              {pathname === '/menu' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
              )}
            </Link>
            <Link href="/contact" className={`px-4 py-2 transition-colors font-medium relative group ${pathname === '/contact' ? 'text-yellow-500' : 'nav-link'}`}>
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 bg-yellow-500/10 scale-0 group-hover:scale-100 transition-transform rounded-lg"></div>
              {pathname === '/contact' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
              )}
            </Link>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ml-auto mr-4 md:mr-0 p-2 rounded-lg text-yellow-500 hover:bg-yellow-500/10 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all p-2 rounded-lg cursor-pointer"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-yellow-500/20 backdrop-blur-lg bg-nav-mobile">
          <div className="px-4 py-4 space-y-3">
            <Link href="/truck" className={`block px-4 py-3 transition-all rounded-lg ${pathname === '/truck' ? 'text-yellow-500 bg-yellow-500/20 border-l-4 border-yellow-500' : 'nav-link hover:bg-yellow-500/10'}`}>
              Find Our Truck
            </Link>
            <Link href="/menu" className={`block px-4 py-3 transition-all rounded-lg ${pathname === '/menu' ? 'text-yellow-500 bg-yellow-500/20 border-l-4 border-yellow-500' : 'nav-link hover:bg-yellow-500/10'}`}>
              Menu
            </Link>
            <Link href="/contact" className={`block px-4 py-3 transition-all rounded-lg ${pathname === '/contact' ? 'text-yellow-500 bg-yellow-500/20 border-l-4 border-yellow-500' : 'nav-link hover:bg-yellow-500/10'}`}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
