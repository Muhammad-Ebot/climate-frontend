//component/ExploreButton.js
'use client';

import React from 'react';
import { BarChart2 } from 'lucide-react';

const ExploreButton = () => {
  const scrollToTabs = () => {
    const tabsSection = document.getElementById('tabs-section');
    if (tabsSection) {
      tabsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button 
      onClick={scrollToTabs}
      className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg transition duration-200">
      <BarChart2 size={20} />
      Explore Data
    </button>
  );
};

export default ExploreButton;