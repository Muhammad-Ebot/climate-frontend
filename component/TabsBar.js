// components/TabsBar.jsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabsBar() {
  const pathname = usePathname();
  const activeTab = pathname.split('/')[1] || 'weatherhistory';

  const tabs = [
    { name: 'Weather History', href: '/weatherhistory' },
    { name: 'Weather Forecast', href: '/weatherforecast' },
    { name: 'heavy rainfall', href: '/heavy-rainfall' },
    { name: 'Drought', href: '/drought' },
    { name: 'Heat wave', href: '/weather-yesterday' },
    { name: 'Weather Today', href: '/weather-today' }
    //{ name: 'Weather Tomorrow', href: '/weather-tomorrow' },
    //{ name: 'Weather Calendar', href: '/weather-calendar' },
    //{ name: 'Weather Last Weekend', href: '/last-weekend' },
    //{ name: 'Weather Next Weekend', href: '/next-weekend' }
  ];

  return (
    <div className="mx-6 md:mx-12 lg:mx-6 bg-gray-50 rounded-lg  shadow-sm my-10">
      <div className="overflow-x-auto">
        <nav className="flex">
          {tabs.map((tab, index) => (
            <div key={tab.name} className="flex items-center">
              <Link 
                href={tab.href}
                className={`px-4 py-3 text-sm md:text-base font-medium whitespace-nowrap text-center ${
                  activeTab === tab.href.split('/')[1] 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {tab.name}
              </Link>
              {index < tabs.length - 1 && (
                <span className="text-gray-300">|</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}