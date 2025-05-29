//component/Navbar.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import ClimatrixLogo from './ClimatrixLogo';
import { Sun, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/weatherdata', label: 'Weather' },
  { href: '/DebugScreen', label: 'Research Work' }
];

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navbarVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <motion.nav 
      initial="initial"
      animate="animate"
      variants={navbarVariants}
      className={`${
        isScrolled 
          ? 'bg-cyan-800 shadow-lg' 
          : 'bg-gradient-to-r from-cyan-900 to-cyan-700'
      } sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link href="/">
              <div className="flex -mx-11">
                <ClimatrixLogo width={180} height={80} />
                <motion.div 
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="hidden md:block ml-1"
                >
                  <Sun size={20} className="text-yellow-300" />
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className={`text-white text-sm font-medium cursor-pointer relative transition duration-300
                  hover:text-yellow-300 ${
                    pathname === item.href ? 'text-yellow-300' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.span 
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-300 rounded-full"
                      layoutId="navUnderline"
                    />
                  )}
                </motion.span>
              </Link>
            ))}

            {/* Heat Alert Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-3 px-4 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link href="/Heat-wave">
                <span className="flex items-center">
                  <Sun size={16} className="mr-1" />
                  Heat Alerts
                </span>
              </Link>
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-cyan-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className="md:hidden"
        initial="closed"
        animate={mobileMenuOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-cyan-800 shadow-lg">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className={`block px-3 -py-7 rounded-md text-base font-medium text-white hover:bg-cyan-700 hover:text-yellow-300 ${
                pathname === item.href ? 'bg-cyan-700 text-yellow-300' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          ))}

          {/* Mobile Heat Alert Button */}
          <div className="px-3 py-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-md text-sm font-medium shadow-md flex items-center justify-center"
            >
              <Link href="/Heat-wave">
                <span className="flex items-center">
                  <Sun size={16} className="mr-1.5" />
                  Heat Wave Alerts
                </span>
              </Link>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
