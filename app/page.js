// app/page.js
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Cloud, 
  Sun, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  Newspaper,
  ArrowRight 
} from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Mock Pakistan weather news - in a real app, this would come from an API
  const weatherNews = [
    {
      id: 1,
      title: "Monsoon rains expected across southern regions this week",
      date: "May 18, 2025",
      source: "Pakistan Meteorological Department"
    },
    {
      id: 2,
      title: "Heat wave alert issued for Sindh province",
      date: "May 17, 2025",
      source: "National Disaster Management Authority"
    },
    {
      id: 3,
      title: "Water levels rising in major reservoirs following recent rainfall",
      date: "May 16, 2025",
      source: "Water and Power Development Authority"
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Weather visuals that float around the page
  const WeatherIcons = () => (
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-20 pointer-events-none">
      <motion.div
        className="absolute text-blue-300"
        initial={{ x: -10, y: 50 }}
        animate={{ 
          x: [20, 50, 20], 
          y: [50, 100, 50] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud size={60} />
      </motion.div>
      
      <motion.div
        className="absolute text-yellow-400 right-20 top-10"
        initial={{ x: 0, y: 0 }}
        animate={{ 
          x: [-30, 30, -30], 
          y: [20, 80, 20],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sun size={48} />
      </motion.div>
      
      <motion.div
        className="absolute text-blue-400 right-40 bottom-40"
        initial={{ x: 0, y: 0 }}
        animate={{ 
          x: [0, 40, 0], 
          y: [0, -60, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        <Droplets size={32} />
      </motion.div>
      
      <motion.div
        className="absolute text-gray-400 left-24 bottom-24"
        initial={{ x: 0, y: 0 }}
        animate={{ 
          x: [0, 60, 0], 
          y: [0, 30, 0] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      >
        <Wind size={40} />
      </motion.div>
      
      <motion.div
        className="absolute text-red-400 left-1/3 top-1/3"
        initial={{ x: 0, y: 0 }}
        animate={{ 
          x: [0, -40, 0], 
          y: [0, -30, 0] 
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <Thermometer size={34} />
      </motion.div>
    </div>
  );

  // Skip animations on first render to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-8 relative min-h-screen p-6">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Climatrix</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            A smart weather intelligence platform designed to detect and predict climate extremes
            such as rainfall, heatwaves, floods, and droughts in real-time — with a special focus
            on Sindh, Pakistan.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">What You Can Do Here</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>View real-time predictions for heatwaves, rainfall, droughts, and floods</li>
            <li>Explore historical climate patterns in Sindh and other regions of Pakistan</li>
            <li>Access interactive charts, trends, and visualizations</li>
            <li>Gain insights through AI-powered forecasts and recommendations</li>
          </ul>
        </section>

        <section className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-700">
            Ready to explore climate insights? Head over to the Weather Data page to see what&apos;s 
            happening — and what might be coming.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative min-h-screen p-6 md:p-8 overflow-x-hidden">
      <WeatherIcons />
      
      {/* Hero Section with Animations */}
      <motion.section 
        className="text-center py-8 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-transparent rounded-xl opacity-70"></div>
        
        <motion.h1 
          className="text-5xl font-bold text-blue-800 mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 120
          }}
        >
          Climatrix
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            A smart weather intelligence platform designed to detect and predict climate extremes
            such as rainfall, heatwaves, floods, and droughts in real-time — with a special focus
            on Sindh, Pakistan.
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-8 flex justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="p-4 text-blue-500 bg-blue-50 rounded-full shadow-md">
            <Thermometer size={28} />
          </div>
          <div className="p-4 text-blue-500 bg-blue-50 rounded-full shadow-md">
            <Droplets size={28} />
          </div>
          <div className="p-4 text-blue-500 bg-blue-50 rounded-full shadow-md">  
            <Cloud size={28} />
          </div>
          <div className="p-4 text-blue-500 bg-blue-50 rounded-full shadow-md">
            <Wind size={28} />
          </div>
        </motion.div>
      </motion.section>
      
      {/* Weather Extremes Section */}
      <motion.section
        className="px-1 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <motion.h2 
          className="text-2xl font-semibold text-blue-700 mb-6 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="border-b-2 border-blue-400 pb-1">Weather Extremes</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Heavy Rainfall */}
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden shadow-md"
          >
            <Link href="/Heavy-Rainfall" className="block h-full no-underline text-current">
              <div className="p-6 flex flex-col h-full">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Droplets size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Heavy Rainfall</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Track intense rainfall patterns and flood risks across Pakistan with real-time monitoring.
                </p>
                <div className="flex items-center text-blue-600 font-medium mt-auto">
                  <span>View details</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </Link>
          </motion.div>
          
          {/* Drought */}
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.4)" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl overflow-hidden shadow-md"
          >
            <Link href="/Drought" className="block h-full no-underline text-current">
              <div className="p-6 flex flex-col h-full">
                <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-amber-700 mb-2">Drought</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Monitor drought conditions and water scarcity risks with advanced prediction models.
                </p>
                <div className="flex items-center text-amber-600 font-medium mt-auto">
                  <span>View details</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </Link>
          </motion.div>
          
          {/* Heat Wave */}
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl overflow-hidden shadow-md"
          >
            <Link href="/Heat-wave" className="block h-full no-underline text-current">
              <div className="p-6 flex flex-col h-full">
                <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Thermometer size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Heat Wave</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Stay informed about extreme temperature events with predictive heat wave analysis.
                </p>
                <div className="flex items-center text-red-600 font-medium mt-auto">
                  <span>View details</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Pakistan Weather News */}
      <motion.section
        className="bg-white rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-6">
          <div className="flex items-center">
            <Newspaper className="text-white mr-3" size={24} />
            <h2 className="text-xl font-semibold text-white m-0">Pakistan Weather News</h2>
          </div>
        </div>
        
        <div className="p-6">
          <ul className="space-y-4">
            {weatherNews.map((news, index) => (
              <motion.li 
                key={news.id}
                className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.15, duration: 0.5 }}
              >
                <h3 className="text-lg font-medium text-gray-800 mb-1">{news.title}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-3">{news.date}</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {news.source}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
          
          <motion.button
            className="mt-6 w-full py-2 bg-blue-50 text-blue-600 rounded-md font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View All Weather News</span>
            <ArrowRight size={16} className="ml-2" />
          </motion.button>
        </div>
      </motion.section>
                
      {/* Features with Staggered Animation */}
      <motion.section
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.h2 
          className="text-2xl font-semibold text-blue-600 mb-4"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          What You Can Do Here
        </motion.h2>
        
        <ul className="space-y-3">
          {[
            {
              text: "View real-time predictions for heatwaves, rainfall, droughts, and floods",
              icon: <Thermometer className="text-red-500" size={20} />
            },
            {
              text: "Explore historical climate patterns in Sindh and other regions of Pakistan",
              icon: <Cloud className="text-blue-500" size={20} />
            },
            {
              text: "Access interactive charts, trends, and visualizations",
              icon: <Droplets className="text-blue-500" size={20} />
            },
            {
              text: "Gain insights through AI-powered forecasts and recommendations",
              icon: <Wind className="text-gray-500" size={20} />
            }
          ].map((item, index) => (
            <motion.li 
              key={index}
              className="flex items-center gap-3 text-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
            >
              <div className="bg-blue-50 p-2 rounded-full">
                {item.icon}
              </div>
              <span>{item.text}</span>
            </motion.li>
          ))}
        </ul>
      </motion.section>
  
      {/* Weather Visualization */}
      <motion.section
        className="rounded-lg overflow-hidden shadow-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <div className="h-40 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ y: 0 }}
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  >
                    <Cloud className="text-white mr-2" size={24} />
                  </motion.div>
                ))}
              </div>
              <p className="text-lg font-semibold">Real-time Climate Analytics</p>
              <p className="text-sm opacity-90">Powered by advanced AI models</p>
            </div>
          </div>
        </div>
      </motion.section>
  
      {/* Call to Action */}
      <motion.section 
        className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      >
        <div className="flex items-center">
          <div className="mr-4">
            <Sun className="text-yellow-500" size={32} />
          </div>
          <div>
            <p className="text-blue-700 font-medium">
              Ready to explore climate insights? Head over to the Weather Data page to see what&apos;s 
              happening — and what might be coming.
            </p>
            <motion.button
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/weatherdata" className="text-white no-underline">
                Explore Weather Data
              </Link>
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}