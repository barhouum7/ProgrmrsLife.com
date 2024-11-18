import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link';
import { FaPaintBrush } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

// Components
import Logo from "../../components/Logo";
import SearchBar from "./SearchBar";
import { CategoryDropdown } from '../../components/navigation/CategoryDropdown';
import { ThemeToggle } from '../../components/theme/ThemeToggle';
import { AnnouncementBanner } from '../../components/AnnouncementBanner';

// Hooks
import { useScrollDetection } from '../../hooks/useScrollDetection';
import { useCategories } from '../../hooks/useCategories';
import { useThemeDetector } from '../../hooks/useThemeDetector';

const Header = () => {
  const [isItemHovered, setIsItemHovered] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [closeBanner, setCloseBanner] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const isScrolled = useScrollDetection();
  const categories = useCategories();
  const { darkMode } = useThemeDetector();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   const link = e.target.getAttribute("href");
  //   if (link) {
  //     router.push(link);
  //   }
  // };

  const navItems = [
    {
      href: "/",
      id: "home",
      content: "Home"
    },
    {
      id: "categories",
      content: (
        <CategoryDropdown
          categories={categories}
          currentPath={router.pathname}
          isScrolled={isScrolled}
          onItemHover={(name) => setIsItemHovered(name)}
          onItemLeave={() => setIsItemHovered("")}
          hoveredItem={isItemHovered}
        />
      )
    },
    {
      href: "/Services",
      id: "services",
      content: "Services"
    },
    {
      href: "/canva-links",
      id: "canva",
      content: (
        <div className="flex items-center space-x-2 group">
          <FaPaintBrush className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span>Canva Pro Teams</span>
          <span className="flex items-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          </span>
        </div>
      )
    }
  ];

  const bgStyle = {
    backgroundColor: isScrolled
      ? "transparent"
      : (darkMode() ? "rgba(28, 35, 43, 0.8)" : "rgba(255, 255, 255, 0.9)"),
    backdropFilter: isScrolled ? "blur(10px)" : "none",
  };


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowBanner(false);
      } else if (!closeBanner) {
        setShowBanner(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [closeBanner]);

  return (
    <header 
      className={`relative ${!showBanner ? 'h-20' : 'h-32'}`}
      style={{ zIndex: 50 }}
    >
      <AnnouncementBanner
        setShowBanner={setShowBanner}
        setCloseBanner={setCloseBanner}
        showBanner={showBanner}
        closeBanner={closeBanner}
      />
      
      <nav
        className={`w-full h-16 fixed transition-all duration-500
          ${showBanner ? 'top-10 sm:top-0 mt-12 sm:mt-0' : 'top-0 mt-0'}
          left-0 flex-grow sm:px-6 rounded-b shadow-lg
          dark:bg-opacity-90 dark:bg-gray-800 bg-opacity-90`}
        style={bgStyle}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Logo />
              <div className="overflow-hidden rounded-lg">
                <span className="relative self-center whitespace-nowrap px-3 ml-1 text-md font-semibold bg-gradient-to-r from-pink-500 to-transparent rounded-lg">
                  Programmers Life
                  <div className="absolute left-1 z-40 inset-0 animated-pro" />
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map(({ href, id, content }) => (
                <div
                  key={id}
                  className="relative group"
                  onMouseEnter={() => setIsItemHovered(id)}
                  onMouseLeave={() => setIsItemHovered("")}
                >
                  {href ? (
                    <Link
                      href={href}
                      className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                        ${router.pathname === href 
                          ? 'text-violet-600 dark:text-violet-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400'
                        }`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="nav-link px-3 py-2">{content}</div>
                  )}
                  <div className={`nav-indicator h-0.5 bg-violet-600 transition-all duration-300 ${isItemHovered === id ? 'w-full' : 'w-0'}`} />
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <SearchBar isScrolled={isScrolled} />
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="z-50 md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <HiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <HiMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed z-40 inset-0 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ top: '4rem' }}
        >
          <div className="bg-white dark:bg-gray-900 h-full shadow-xl">
            <div className="pt-4 pb-3 space-y-1">
              {navItems.map(({ href, id, content }) => (
                <div
                  key={id}
                  className="relative group px-4"
                  onMouseEnter={() => setIsItemHovered(id)}
                  onMouseLeave={() => setIsItemHovered("")}
                >
                  {href ? (
                    <Link
                      href={href}
                      className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        router.pathname === href
                          ? 'text-violet-600 dark:text-violet-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400'
                      }`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="px-3 py-2">{content}</div>
                  )}
                  <div className={`nav-indicator h-0.5 bg-violet-600 transition-all duration-300 ${isItemHovered === id ? 'w-full' : 'w-0'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;