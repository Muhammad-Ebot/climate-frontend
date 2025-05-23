//component/UnitToggle.js
"use client";
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';

export default function UnitToggle({ unit, setUnit }) {
  // Enhanced toggle function with animation delay
  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return; // Don't change if already selected
    setUnit(newUnit);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <Thermometer className="w-5 h-5 text-blue-600 mr-2" />
        Temperature Units
      </h2>
      
      <div className="relative">
        {/* Animated Selection Indicator */}
        <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50 relative">
          <motion.div
            className="absolute top-1 bottom-1 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 shadow-md z-0"
            animate={{
              left: unit === 'metric' ? '0%' : '50%',
              right: unit === 'metric' ? '50%' : '0%'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            initial={false}
          />
          
          {/* Buttons */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 z-10 rounded-md font-medium text-center relative transition-colors duration-200 flex items-center justify-center ${
              unit === 'metric' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => handleUnitChange('metric')}
          >
            <span className="mr-1">°C</span>
            <span className="text-xs opacity-80">Celsius</span>
            
            {unit === 'metric' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-blue-400 rounded-md opacity-0"
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 z-10 rounded-md font-medium text-center relative transition-colors duration-200 flex items-center justify-center ${
              unit === 'imperial' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => handleUnitChange('imperial')}
          >
            <span className="mr-1">°F</span>
            <span className="text-xs opacity-80">Fahrenheit</span>
            
            {unit === 'imperial' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-blue-400 rounded-md opacity-0"
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        </div>
        
        {/* Unit Description */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          key={unit} // Forces re-render on unit change
          className="mt-3 text-xs text-gray-500 bg-blue-50 rounded-md p-2 border border-blue-100"
        >
          {unit === 'metric' ? (
            <p>Celsius (°C) is used in most countries worldwide. Water freezes at 0°C and boils at 100°C.</p>
          ) : (
            <p>Fahrenheit (°F) is primarily used in the United States. Water freezes at 32°F and boils at 212°F.</p>
          )}
        </motion.div>
      </div>
      
      {/* Conversion Scale Visualization */}
      <motion.div 
        className="mt-4 relative h-1 bg-gray-200 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-gradient-to-r from-blue-200 to-blue-400"></div>
          <div className="flex-1 bg-gradient-to-r from-blue-400 to-red-500"></div>
        </div>
        
        <div className="relative flex justify-between mt-1 text-xs text-gray-500">
          <span>Cold</span>
          <span className="text-center">Mild</span>
          <span className="text-right">Hot</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-3 text-xs text-center text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.4 }}
      >
        Your preference is saved automatically
      </motion.div>
    </motion.div>
  );
}