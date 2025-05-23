//app/WeatherPicture/page.js
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

// Pakistan Weather Picture Gallery Component for Next.js
export default function WeatherPictures() {
  // Weather image data for Pakistan - moved to useMemo to fix dependency warning
  const pakistanWeatherData = useMemo(() => [
    {
      id: 1,
      title: "Monsoon Season in Islamabad",
      image: "/api/placeholder/800/500",
      description: "Heavy monsoon rainfall in Pakistan's capital city occurs from July to September. Islamabad receives an average of 790mm of rain during this period, transforming the landscape with lush greenery.",
      category: "Seasonal Weather"
    },
    {
      id: 2,
      title: "Karakoram Mountain Range Snow",
      image: "/api/placeholder/800/500",
      description: "The majestic Karakoram Range in northern Pakistan features some of the world's highest peaks. These mountains remain snow-covered year-round, with temperatures dropping to -30°C in winter.",
      category: "Mountain Climate"
    },
    {
      id: 3,
      title: "Thar Desert Drought Conditions",
      image: "/api/placeholder/800/500", 
      description: "The Thar Desert in southeastern Pakistan experiences extreme heat and drought. Summer temperatures regularly exceed 45°C, with annual rainfall less than 100mm, creating challenging living conditions.",
      category: "Climate Extremes" 
    },
    {
      id: 4,
      title: "Coastal Mangroves of Sindh",
      image: "/api/placeholder/800/500",
      description: "Pakistan's southern coastline features extensive mangrove forests adapted to the humid subtropical climate. These ecosystems endure temperature variations from 20-40°C and are affected by cyclones from the Arabian Sea.",
      category: "Coastal Climate"
    },
    {
      id: 5,
      title: "2022 Pakistan Floods",
      image: "/api/placeholder/800/500",
      description: "The catastrophic 2022 floods affected over 33 million people, submerging one-third of Pakistan. Abnormal monsoon rainfall, accelerated glacier melting, and inadequate dam infrastructure caused this climate disaster.",
      category: "Climate Extremes"
    },
    {
      id: 6,
      title: "Lahore Smog Season",
      image: "/api/placeholder/800/500",
      description: "During winter months, Lahore experiences severe smog, with Air Quality Index readings frequently exceeding 500 (hazardous level). This phenomenon results from temperature inversion trapping pollutants from vehicles, industries, and crop burning.",
      category: "Urban Climate Issues"
    },
    {
      id: 7,
      title: "Siachen Glacier",
      image: "/api/placeholder/800/500",
      description: "The Siachen Glacier in the eastern Karakoram Range is the world's highest battleground. Temperatures can drop to -50°C with unpredictable blizzards and avalanches. The glacier has been receding at an alarming rate due to climate change.",
      category: "Mountain Climate"
    },
    {
      id: 8,
      title: "Cherry Blossoms in Hunza Valley",
      image: "/api/placeholder/800/500",
      description: "The Hunza Valley experiences a unique microclimate that allows for cherry blossoms to bloom spectacularly in spring. The valley's elevation creates moderate temperatures between 10-15°C during this season, drawing tourists from across the country.",
      category: "Seasonal Weather"
    },
    {
      id: 9,
      title: "Heat Wave in Jacobabad",
      image: "/api/placeholder/800/500",
      description: "Jacobabad is considered one of the hottest cities on Earth. In summer, temperatures regularly exceed 50°C, making it nearly uninhabitable during peak heat waves. Climate change is intensifying these extreme conditions.",
      category: "Climate Extremes"
    },
    {
      id: 10,
      title: "Fog in Punjab Plains",
      image: "/api/placeholder/800/500",
      description: "Dense winter fog blankets Punjab from December to February, reducing visibility to under 50 meters and disrupting transportation networks. This phenomenon has worsened due to increasing air pollution and changing climate patterns.",
      category: "Seasonal Weather"
    }
  ], []);

  // States for filtering and modal
  const [filteredItems, setFilteredItems] = useState(pakistanWeatherData);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter gallery based on search and category
  useEffect(() => {
    const filtered = pakistanWeatherData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, categoryFilter, pakistanWeatherData]);

  // Handle opening modal with item details
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="weather-gallery-app">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pakistan Weather & Climate Gallery</h1>
        <p className="text-gray-600">Explore the diverse weather patterns and climate extremes across Pakistan&apos;s varied geography</p>
      </header>
      
      {/* Filter Controls */}
      <div className="filter-controls mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search images..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full md:w-64"
          />
        </div>
        <div className="category-filter">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="all">All Categories</option>
            <option value="Seasonal Weather">Seasonal Weather</option>
            <option value="Mountain Climate">Mountain Climate</option>
            <option value="Climate Extremes">Climate Extremes</option>
            <option value="Coastal Climate">Coastal Climate</option>
            <option value="Urban Climate Issues">Urban Climate Issues</option>
          </select>
        </div>
      </div>
      
      {/* Gallery Container */}
      <div className="gallery-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <p className="col-span-full text-center py-10 text-gray-500 text-lg">No images match your search criteria.</p>
        ) : (
          filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="gallery-item overflow-hidden rounded-lg shadow-md cursor-pointer transform transition hover:-translate-y-1"
              onClick={() => openModal(item)}
            >
              <div className="image-container relative aspect-[4/3] overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.title}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover transition duration-500 hover:scale-105"
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyv&gt;&gt;&gt;&gt;"
                />
                <div className="image-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                  <span className="category-tag bg-white/20 text-xs px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50" onClick={closeModal}>
          <div 
            className="modal-content bg-white rounded-lg overflow-hidden w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image 
                src={selectedItem.image} 
                alt={selectedItem.title}
                width={800}
                height={500}
                className="w-full max-h-[60vh] object-cover"
                priority={false}
              />
              <button 
                className="absolute top-4 right-4 text-white text-3xl cursor-pointer drop-shadow-lg"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedItem.title}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">{selectedItem.description}</p>
              <p className="text-gray-500 italic">Category: {selectedItem.category}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Inline Styles */}
      <style jsx>{`
        .weather-gallery-app {
          font-family: 'Arial', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}