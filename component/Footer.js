//component/Footer.js
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn
} from 'react-icons/fa';
import { 
  Mail, 
  MapPin, 
  Phone, 
  ArrowUp, 
  CloudRain, 
  Sun, 
  Wind 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.3 }
    }
  };
  
  const weatherIcons = [
    { icon: <Sun size={18} />, label: "Sunny" },
    { icon: <CloudRain size={18} />, label: "Rainy" },
    { icon: <Wind size={18} />, label: "Windy" }
  ];

  return (
    <footer className="bg-gradient-to-b from-cyan-900 to-cyan-800 text-white relative">
            
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Column 1: Brand and Description */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-100">Climatrix</h2>
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="ml-2"
              >
                <Sun size={18} className="text-yellow-300" />
              </motion.div>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted source for accurate weather forecasting and climate data. 
              Stay informed with our comprehensive meteorological services.
            </p>
            <div className="pt-2">
              <p className="font-semibold text-sm">© {currentYear} Climatrix</p>
              <p className="text-xs text-gray-300">All rights reserved.</p>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-cyan-700 pb-2 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm grid grid-cols-2">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  Home
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/about" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  About
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/weatherdata" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  Weather Data
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/weatherhistory" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  Weather History
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/todayweather" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  Today Weather
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/Heavy-Rainfall" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  Rainfall
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/Drought" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  Drought
                </Link>
              </motion.li>              
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/Heat-wave" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  Heatwave
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/WeatherPictures" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  Research Work
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/gridmap" className="hover:text-yellow-300 transition duration-300 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-300 rounded-full mr-2"></span>
                  Pakistan Grid Map
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
              </motion.li>
            </ul>
          </motion.div>

          {/* Column 3: Contact Information */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-cyan-700 pb-2 mb-3">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-0.5 text-yellow-300 flex-shrink-0" />
                <span className="text-gray-300">
                  ST-13 Abul Hasan Isphahani Rd, Block 7 Gulshan-e-Iqbal, Karachi, 75300
                  </span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-yellow-300 flex-shrink-0" />
                <span className="text-gray-300">+92 336 1505100</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-yellow-300 flex-shrink-0" />
                <span className="text-gray-300">climatrix07@gmail.com</span>
              </li>
            </ul>
            
            {/* Weather Icons Animation */}
            <div className="flex justify-between items-center mt-4 px-2">
              {weatherIcons.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 0 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    delay: index * 0.5
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="p-2 bg-cyan-700 rounded-full text-yellow-300">
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1 text-gray-300">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Column 4: Newsletter & Social */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-cyan-700 pb-2 mb-3">Stay Connected</h3>
            
            {/* Social Media Links */}
            <div>
              <p className="text-sm mb-2">Follow us</p>
              <div className="flex gap-3">
                <motion.a
                  whileHover="hover"
                  variants={iconVariants}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="bg-cyan-700 hover:bg-cyan-600 p-2 rounded-full text-white transition duration-300"
                >
                  <FaFacebookF />
                </motion.a>
                <motion.a
                  whileHover="hover"
                  variants={iconVariants}
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="bg-cyan-700 hover:bg-cyan-600 p-2 rounded-full text-white transition duration-300"
                >
                  <FaTwitter />
                </motion.a>
                <motion.a
                  whileHover="hover"
                  variants={iconVariants}
                  href="https://www.instagram.com/climatrix07/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="bg-cyan-700 hover:bg-cyan-600 p-2 rounded-full text-white transition duration-300"
                >
                  <FaInstagram />
                </motion.a>
                <motion.a
                  whileHover="hover"
                  variants={iconVariants}
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="bg-cyan-700 hover:bg-cyan-600 p-2 rounded-full text-white transition duration-300"
                >
                  <FaLinkedinIn />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Bottom Divider */}
        <div className="border-t border-cyan-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400 mb-3 md:mb-0">
            Providing accurate weather forecasts and climate data since 2025
          </p>
          
          <div className="flex items-center space-x-4">
            <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-yellow-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-yellow-300">
              Terms of Service
            </Link>
            
            {/* Scroll to top button */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="bg-cyan-700 hover:bg-cyan-600 p-2 rounded-full text-white transition-colors duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;