'use client';

import React from 'react';

const MapButton = () => {
  const scrollToTabs = () => {
    const tabsSection = document.getElementById('tabs-section');
    if (tabsSection) {
      tabsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button 
      onClick={scrollToTabs}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200">
      Load Interactive Map
    </button>
  );
};

export default MapButton;