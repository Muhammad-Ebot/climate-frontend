//component/ClimatrixLogo.js
import React from 'react';

const ClimatrixLogo = ({ width = 400, height = 200, className = '' }) => {
  return (
    <svg 
      viewBox="0 0 400 200" 
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0c8a6f" />
          <stop offset="100%" stopColor="#074d7e" />
        </linearGradient>
        
        {/* Leaf pattern */}
        <pattern id="leafPattern" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M10,25 Q20,5 30,25 T50,25" fill="none" stroke="#ffffff20" strokeWidth="1"/>
        </pattern>
      </defs>
      
      {/* Main background */}
      <rect x="0" y="0" width="400" height="200" rx="15" fill="url(#bg-gradient)" />
      <rect x="0" y="0" width="400" height="200" rx="15" fill="url(#leafPattern)" />
      
      {/* Earth icon */}
      <circle cx="100" cy="100" r="45" fill="#074d7e" stroke="#ffffff" strokeWidth="2"/>
      <path d="M70,80 Q100,120 130,80 T130,120" fill="none" stroke="#ffffff" strokeWidth="2"/>
      <path d="M70,90 Q100,130 130,90" fill="none" stroke="#ffffff" strokeWidth="2"/>
      
      {/* Temperature grid/graph */}
      <g transform="translate(160, 85)">
        <path d="M0,20 L20,-10 L40,5 L60,-20 L80,10 L100,0" stroke="#ff6b4a" strokeWidth="3" fill="none"/>
        <line x1="0" y1="-25" x2="0" y2="25" stroke="#ffffff60" strokeWidth="1"/>
        <line x1="20" y1="-25" x2="20" y2="25" stroke="#ffffff60" strokeWidth="1"/>
        <line x1="40" y1="-25" x2="40" y2="25" stroke="#ffffff60" strokeWidth="1"/>
        <line x1="60" y1="-25" x2="60" y2="25" stroke="#ffffff60" strokeWidth="1"/>
        <line x1="80" y1="-25" x2="80" y2="25" stroke="#ffffff60" strokeWidth="1"/>
        <line x1="100" y1="-25" x2="100" y2="25" stroke="#ffffff60" strokeWidth="1"/>
      </g>
      
      {/* Leaf symbol */}
      <path d="M300,80 C340,70 350,110 310,120 C350,130 340,170 300,160 C310,130 310,110 300,80" fill="#4eda89"/>
      <path d="M300,80 C300,110 300,130 300,160" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
      
      {/* Text */}
      <text x="200" y="160" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" textAnchor="middle" fill="#ffffff">CLIMATRIX</text>
    </svg>
  );
};

export default ClimatrixLogo;