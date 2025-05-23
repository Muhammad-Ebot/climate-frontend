// components/LocationSearch.jsx
"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Compass, Loader } from 'lucide-react';

// Lazy-load the map to avoid SSR issues
const Map = dynamic(() => import('./PakistanMap'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center">
        <Loader className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="mt-2 text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

export default function LocationSearch({ location, setLocation }) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [province, setProvince] = useState('');
  const [activeMethod, setActiveMethod] = useState('coordinates'); // 'coordinates' | 'map' | 'gps'
  const [mapCoords, setMapCoords] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Handle GPS location
  const getDeviceLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);
    setActiveMethod('gps');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(4));
        setLon(position.coords.longitude.toFixed(4));
        setIsGettingLocation(false);
        setActiveMethod('coordinates'); // Switch back to show coordinates
      },
      (error) => {
        setLocationError(`Error: ${error.message}`);
        setIsGettingLocation(false);
      }
    );
  };

  // Handle map click
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMapCoords({ lat, lng });
    setLat(lat.toFixed(4));
    setLon(lng.toFixed(4));
  };

  // Submit handler
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!lat || !lon) {
      setLocationError('Please provide location data');
      return;
    }

    setLocation({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      province: province || null,
      name: province ? `${province} (${lat}, ${lon})` : `Location (${lat}, ${lon})`
    });
    
    // Feedback animation can be added here
  };

  // Reset error on tab change
  useEffect(() => {
    setLocationError(null);
  }, [activeMethod]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <MapPin className="w-5 h-5 text-blue-600 mr-2" />
        Search Location
      </h2>
      
      {/* Method Selector Tabs */}
      <div className="flex w-full mb-4 bg-gray-50 rounded-md p-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium flex-1 transition-all ${
            activeMethod === 'coordinates' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
          }`}
          onClick={() => setActiveMethod('coordinates')}
        >
          <Compass className="w-4 h-4 mr-2" />
          Coordinates
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium flex-1 transition-all ${
            activeMethod === 'map' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
          }`}
          onClick={() => setActiveMethod('map')}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Map
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium flex-1 transition-all ${
            activeMethod === 'gps' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
          }`}
          onClick={getDeviceLocation}
          disabled={isGettingLocation}
        >
          <Navigation className={`w-4 h-4 mr-2 ${isGettingLocation ? 'animate-pulse' : ''}`} />
          {isGettingLocation ? 'Locating...' : 'My Location'}
        </motion.button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSearch} className="space-y-4">
        <AnimatePresence mode="wait">
          {locationError && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm"
            >
              {locationError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coordinate Input */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="text-xs text-gray-500 mb-1 block">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="longitude"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="relative">
              <label className="text-xs text-gray-500 mb-1 block">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="latitude"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          
          {/* Province Input */}
          <div className="relative">
            <label className="text-xs text-gray-500 mb-1 block">Province (optional)</label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Select or enter province name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              list="provinces"
            />
            <datalist id="provinces">
              <option value="Sindh" />
              <option value="Punjab" />
              <option value="Balochistan" />
              <option value="KPK" />
              <option value="Azad Kashmir" />
              <option value="Gilgit Baltistan" />
              <option value="Federal Capital Territory" />
              <option value="FATA" />
            </datalist>
          </div>
        </div>

        {/* Map Container */}
        <AnimatePresence mode="wait">
          {activeMethod === 'map' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              <div className="h-64 w-full border rounded-lg overflow-hidden bg-blue-50">
                <Map onMapClick={handleMapClick} selectedCoords={mapCoords} />
              </div>
              {mapCoords && (
                <div className="mt-2 text-sm text-gray-600 flex items-center justify-center bg-blue-50 p-2 rounded-md">
                  <MapPin className="w-4 h-4 text-blue-600 mr-1" />
                  Selected: {mapCoords.lat.toFixed(4)}, {mapCoords.lng.toFixed(4)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* GPS Status */}
        <AnimatePresence mode="wait">
          {activeMethod === 'gps' && isGettingLocation && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center p-4 text-gray-600"
            >
              <Loader className="w-5 h-5 text-blue-500 animate-spin mr-2" />
              Detecting your location...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-md hover:shadow-md transition-all font-medium flex items-center justify-center"
        >
          <MapPin className="w-5 h-5 mr-2" />
          Search This Location
        </motion.button>
      </form>
    </motion.div>
  );
}