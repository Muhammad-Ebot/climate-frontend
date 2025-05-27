//app/weatherdata/page.js
import React from 'react';
import Link from 'next/link';
import TabsBar from '@/component/TabsBar';
import { Cloud, Sun, BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';
import ExploreButton from '@/component/ExploreButton';
import PakistanGridsMap from '@/component/PakistanGridsMap';

const WeatherData = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 pt-16 pb-24 px-6 sm:px-10 md:px-16 text-white overflow-hidden">
        <div className="absolute top-0 right-0 opacity-20">
          <Sun size={200} className="text-yellow-300" />
        </div>
        <div className="absolute bottom-0 left-10 opacity-20">
          <Cloud size={120} className="text-white" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pakistan&apos;s Weather</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Comprehensive weather data and climate extremes insights and analytics to understand weather patterns across Pakistan
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ExploreButton />
            <button className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg transition duration-200">
              <AlertTriangle size={20} />
              Weather Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Tabs and Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Interactive Map Preview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pakistan Grid Map</h2>
          <div className="bg-gray-100 rounded-lg flex items-center justify-center">
            <PakistanGridsMap/>
          </div>
        </div>

        {/* Tabs Section */}
        <div id="tabs-section" className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore Weather Data</h2>
          <p className="text-gray-600 mb-8">
            Ready to explore climate insights? Navigate through our comprehensive data tabs to discover current patterns and future forecasts across Pakistan.
          </p>
          <div className='-mx-10'>
            <TabsBar className/>
          </div>          
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-xl p-8 text-white">
          <div className="md:flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Subscribe to Weather Alerts</h3>
              <p className="text-blue-100 max-w-2xl">
                Stay informed with real-time weather notifications and personalized forecasts delivered directly to you.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition duration-200 shadow-lg">
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Data Card Component would be removed if not needed elsewhere


export default WeatherData;

export const metadata = {
  title: "Weather Data | Climatrix",
  description: "Comprehensive Pakistan Weather Data and Climate Analytics Platform",
};