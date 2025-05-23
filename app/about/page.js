//app/about/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CloudRain, Thermometer, GanttChart, Database, PieChart, Brain, Users, Globe, Leaf } from "lucide-react";

export default function About() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Background animation elements
  const BackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-15 pointer-events-none">
      <motion.div
        className="absolute text-blue-300 top-10 left-10"
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Globe size={80} />
      </motion.div>
      
      <motion.div
        className="absolute text-green-400 bottom-20 right-20"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <Leaf size={100} />
      </motion.div>
      
      <motion.div
        className="absolute text-blue-400 right-1/4 top-1/3"
        initial={{ y: 0 }}
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudRain size={60} />
      </motion.div>
    </div>
  );

  // Skip animations on first render to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen p-6 space-y-8 relative">
        <h1 className="text-3xl font-bold text-blue-800">About Climatrix</h1>
        <div className="prose max-w-none">
          <p>About page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-10 relative overflow-x-hidden">
      <BackgroundElements />
      
      {/* Header section */}
      <motion.header
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl opacity-70"></div>
        <div className="py-10 px-6">
          <motion.h1 
            className="text-4xl font-bold text-blue-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            About Climatrix
          </motion.h1>
          <motion.div
            className="max-w-3xl mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              Climatrix is built on a vision to create a comprehensive climate intelligence platform that 
              leverages advanced AI technologies to provide critical insights for climate adaptation and risk 
              management in vulnerable regions, starting with Sindh, Pakistan.
            </p>
          </motion.div>
        </div>
      </motion.header>
      
      {/* Mission section */}
      <motion.section
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <div className="p-6">
          <motion.div
            className="flex items-center mb-4"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="p-3 bg-blue-50 rounded-full mr-4">
              <Globe className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-blue-800">Our Mission</h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="text-gray-700 leading-relaxed">
              We aim to empower local communities, government agencies, and organizations with accurate, 
              timely, and actionable climate intelligence to enhance resilience against climate extremes and 
              build sustainable adaptation strategies. By combining cutting-edge AI models with local climate 
              data, we provide insights that are contextually relevant and impactful.
            </p>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Technology section */}
      <motion.section
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
        <div className="p-6">
          <motion.div
            className="flex items-center mb-6"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="p-3 bg-blue-50 rounded-full mr-4">
              <Brain className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-blue-800">Our Technology</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Database className="text-blue-500" size={20} />,
                title: "Advanced Data Processing",
                description: "We integrate multiple data sources including satellite imagery, ground measurements, and historical climate records."
              },
              {
                icon: <GanttChart className="text-blue-500" size={20} />,
                title: "Predictive Modeling",
                description: "Our AI models predict climate patterns with high accuracy, providing forecasts for various climate extremes."
              },
              {
                icon: <PieChart className="text-blue-500" size={20} />,
                title: "Interactive Visualization",
                description: "Complex climate data is transformed into intuitive visualizations for easier understanding and decision-making."
              },
              {
                icon: <Thermometer className="text-blue-500" size={20} />,
                title: "Real-time Monitoring",
                description: "Continuous monitoring systems track climate variables to provide early warnings about potential extreme events."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-blue-50 p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-white rounded-full mr-3">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-blue-700">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Impact section */}
      <motion.section
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        <div className="p-6">
          <motion.div
            className="flex items-center mb-4"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="p-3 bg-blue-50 rounded-full mr-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-blue-800">Our Impact</h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <p className="text-gray-700 leading-relaxed mb-4">
              Climatrix is designed to create meaningful impact through climate intelligence:
            </p>
            
            <div className="space-y-3 ml-4">
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3 mt-0.5">1</div>
                <p className="text-gray-700">Helping communities prepare for and respond to climate extremes</p>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3 mt-0.5">2</div>
                <p className="text-gray-700">Supporting government agencies in climate-informed policy development</p>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3 mt-0.5">3</div>
                <p className="text-gray-700">Enabling organizations to implement targeted climate adaptation measures</p>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3 mt-0.5">4</div>
                <p className="text-gray-700">Building a comprehensive climate risk management ecosystem</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Call to Action */}
      <motion.section 
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        <motion.div
          className="text-center"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-3">Join Us in Climate Resilience</h2>
          <p className="text-blue-100 mb-6">
            Explore our weather data platform and see how Climatrix can help your community prepare for climate challenges.
          </p>
          <motion.button
            className="px-6 py-3 bg-white text-blue-700 rounded-md font-medium shadow-sm hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/weatherdata" className="text-blue-700 no-underline">
              Explore Weather Data
            </Link>
          </motion.button>
        </motion.div>
      </motion.section>
    </div>
  );
}