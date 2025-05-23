//component/TabsBar.js
"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Droplet, 
  Thermometer, 
  CalendarClock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function TabsBar() {
  const pathname = usePathname();
  const activeTab = pathname.split('/')[1] || 'weatherhistory';
  const [hoveredTab, setHoveredTab] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  
  const scrollContainerRef = useRef(null);

  // Check if scroll buttons are needed
  const checkForScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // Scroll to active tab on mount
  useEffect(() => {
    setMounted(true);
    
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-active="true"]`);
      if (activeElement) {
        const scrollPosition = activeElement.offsetLeft - scrollContainerRef.current.clientWidth / 2 + activeElement.clientWidth / 2;
        scrollContainerRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
      
      // Check if scroll buttons are needed initially
      checkForScrollButtons();
      
      // Add scroll event listener
      scrollContainerRef.current.addEventListener('scroll', checkForScrollButtons);
      
      // Add resize listener too since window resize can affect scroll status
      window.addEventListener('resize', checkForScrollButtons);
    }
    
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', checkForScrollButtons);
      }
      window.removeEventListener('resize', checkForScrollButtons);
    };
  }, [activeTab]);

  const tabs = [
    { name: 'Weather History', href: '/weatherhistory', icon: <Cloud /> },
    { name: 'Today Weather', href: '/todayweather', icon: <Sun /> },
    { name: 'Rainfall', href: '/Heavy-Rainfall', icon: <CloudRain /> },
    { name: 'Drought', href: '/Drought', icon: <Droplet /> },
    { name: 'Heat wave', href: '/Heat-wave', icon: <Thermometer /> },
    { name: 'Weather Forecast', href: '/weatherforecast', icon: <CalendarClock /> }
  ];

  // If not mounted yet, show a skeleton loader
  if (!mounted) {
    return (
      <div className="mx-6 md:mx-12 lg:mx-24 my-10">
        <div className="h-16 bg-blue-50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mx-6 md:mx-12 lg:mx-24 my-10"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 rounded-lg blur-lg opacity-60"></div>
      
      {/* Main container */}
      <div className="relative overflow-hidden bg-white backdrop-blur-sm bg-opacity-90 rounded-lg shadow-lg border border-blue-100">
        {/* Left scroll button */}
        <AnimatePresence>
          {showLeftScroll && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.9, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={scrollLeft}
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 bg-gradient-to-r from-white to-transparent"
              aria-label="Scroll left"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:bg-blue-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Right scroll button */}
        <AnimatePresence>
          {showRightScroll && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.9, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={scrollRight}
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 bg-gradient-to-l from-white to-transparent"
              aria-label="Scroll right"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:bg-blue-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Tabs container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <nav className="flex">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.href.split('/')[1];
              const isHovered = hoveredTab === index;
              
              return (
                <div key={tab.name} className="flex items-center">
                  <Link 
                    href={tab.href}
                    data-active={isActive}
                    className={`relative px-5 py-4 text-sm md:text-base font-medium whitespace-nowrap text-center transition-all duration-300 ease-in-out flex items-center group ${
                      isActive 
                        ? 'text-blue-600 bg-gradient-to-b from-blue-50 to-blue-100/40' 
                        : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50/30'
                    }`}
                    onMouseEnter={() => setHoveredTab(index)}
                    onMouseLeave={() => setHoveredTab(null)}
                  >
                    <motion.span 
                      animate={{ 
                        scale: isActive || isHovered ? 1.1 : 1,
                        rotate: isHovered ? [0, -10, 10, -5, 0] : 0
                      }}
                      transition={{ 
                        scale: { duration: 0.3 },
                        rotate: { duration: 0.5, ease: "easeInOut" }
                      }}
                      className={`mr-2 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'}`}
                    >
                      {tab.icon}
                    </motion.span>
                    <span className={`transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}>
                      {tab.name}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.span 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Hover indicator */}
                    {!isActive && (
                      <motion.span 
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-300"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                  
                  {/* Tab separator */}
                  {index < tabs.length - 1 && (
                    <div className="h-6 w-px bg-gradient-to-b from-transparent via-blue-100 to-transparent opacity-80" />
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Subtle reflection effect */}
      <div className="absolute left-4 right-4 h-4 bg-gradient-to-b from-blue-100/40 to-transparent rounded-b-full blur-sm"></div>
    </motion.div>
  );
}