"use client";

import { useEffect, useRef, useState } from 'react';

export default function WeatherMap({ location, weatherData, unit }) {
  const mapRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  
  // Load required CSS for Leaflet
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.css';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  
  // Initialize map once component mounts
  useEffect(() => {
    // Load Leaflet script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.js';
    script.async = true;
    
    script.onload = () => {
      setIsReady(true);
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  // Initialize the map after Leaflet is loaded
  useEffect(() => {
    if (!isReady || !mapRef.current || mapInstance) return;
    
    const L = window.L;
    
    // Default center (Pakistan) if no location is provided
    const defaultCenter = [30.3753, 69.3451];
    const mapCenter = location ? [location.lat, location.lon] : defaultCenter;
    
    // Initialize map
    const map = L.map(mapRef.current, {
      center: mapCenter,
      zoom: location ? 8 : 5,
      zoomControl: true,
      preferCanvas: false
    });
    
    // Add dark tile layer for better weather visualization
    const tileLayer = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        minZoom: 0,
        maxZoom: 19,
        attribution: "<a href=\"gridmap\">Climatrix</a>",
        subdomains: "abcd",
      }
    );
    
    tileLayer.addTo(map);
    
    setMapInstance(map);
    
    // Clean up on unmount
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [isReady, location]);
  
  // Update map with weather overlays when weather data changes
  useEffect(() => {
    if (!mapInstance || !weatherData || !location) return;
    
    const L = window.L;
    
    // Clear existing layers except the base tile layer
    mapInstance.eachLayer((layer) => {
      if (layer !== mapInstance._layers[Object.keys(mapInstance._layers)[0]]) {
        mapInstance.removeLayer(layer);
      }
    });
    
    // Create custom weather marker with detailed popup
    const weatherIcon = L.divIcon({
      className: 'custom-weather-marker',
      html: `
        <div style="
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          border: 3px solid #3B82F6;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
          ${getWeatherEmoji(weatherData.current.weather_code, weatherData.current.is_day)}
        </div>
      `,
      iconSize: [60, 60],
      iconAnchor: [30, 30]
    });
    
    // Add weather marker with detailed popup
    const marker = L.marker([location.lat, location.lon], { icon: weatherIcon })
      .addTo(mapInstance)
      .bindPopup(`
        <div style="font-family: system-ui; min-width: 200px;">
          <h3 style="margin: 0 0 10px 0; color: #1F2937; font-size: 16px;">${location.name}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
            <div><strong>Temperature:</strong></div>
            <div>${weatherData.current.temp}°${unit === 'metric' ? 'C' : 'F'}</div>
            
            <div><strong>Feels like:</strong></div>
            <div>${weatherData.current.feels_like}°${unit === 'metric' ? 'C' : 'F'}</div>
            
            <div><strong>Condition:</strong></div>
            <div>${weatherData.current.weather_condition}</div>
            
            <div><strong>Humidity:</strong></div>
            <div>${weatherData.current.humidity}%</div>
            
            <div><strong>Wind:</strong></div>
            <div>${weatherData.current.wind.direction} ${weatherData.current.wind.speed} ${unit === 'metric' ? 'km/h' : 'mph'}</div>
            
            <div><strong>Pressure:</strong></div>
            <div>${weatherData.current.pressure} hPa</div>
          </div>
        </div>
      `, {
        maxWidth: 300,
        closeButton: true
      });
    
    // Temperature gradient circle
    const tempColor = getTemperatureColor(weatherData.current.temp, unit);
    const tempCircle = L.circle([location.lat, location.lon], {
      color: tempColor,
      fillColor: tempColor,
      fillOpacity: 0.3,
      radius: 50000,
      weight: 2
    }).addTo(mapInstance);
    
    // Humidity indicator
    const humidityColor = getHumidityColor(weatherData.current.humidity);
    const humidityCircle = L.circle([location.lat + 0.2, location.lon + 0.2], {
      color: humidityColor,
      fillColor: humidityColor,
      fillOpacity: 0.25,
      radius: 30000,
      weight: 2
    }).addTo(mapInstance);
    
    // Pressure indicator
    const pressureColor = getPressureColor(weatherData.current.pressure);
    const pressureCircle = L.circle([location.lat - 0.2, location.lon - 0.2], {
      color: pressureColor,
      fillColor: pressureColor,
      fillOpacity: 0.25,
      radius: 25000,
      weight: 2
    }).addTo(mapInstance);
    
    // Wind direction arrow
    const windArrow = createWindArrow(location.lat, location.lon, weatherData.current.wind.direction_degrees, weatherData.current.wind.speed);
    windArrow.addTo(mapInstance);
    
    // Add cloud cover overlay if significant
    if (weatherData.current.cloud_cover > 30) {
      const cloudOpacity = Math.min(weatherData.current.cloud_cover / 100 * 0.4, 0.4);
      const cloudCircle = L.circle([location.lat, location.lon], {
        color: '#94A3B8',
        fillColor: '#94A3B8',
        fillOpacity: cloudOpacity,
        radius: 40000,
        weight: 1,
        dashArray: '5, 5'
      }).addTo(mapInstance);
    }
    
    // Add precipitation overlay if present
    if (weatherData.current.precipitation > 0) {
      const precipColor = weatherData.current.precipitation > 5 ? '#1E40AF' : '#3B82F6';
      const precipCircle = L.circle([location.lat, location.lon], {
        color: precipColor,
        fillColor: precipColor,
        fillOpacity: 0.4,
        radius: 35000,
        weight: 2
      }).addTo(mapInstance);
    }
    
    // Update map view
    mapInstance.setView([location.lat, location.lon], 8);
    
  }, [mapInstance, weatherData, location, unit]);
  
  // Helper functions for weather visualization
  function getWeatherEmoji(code, isDay) {
    if (code === 0) return isDay ? '☀️' : '🌙';
    if (code >= 1 && code <= 3) return isDay ? '⛅' : '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '☁️';
  }
  
  function getTemperatureColor(temp, unit) {
    // Convert to Celsius for consistent color mapping
    const tempC = unit === 'metric' ? temp : (temp - 32) * 5/9;
    
    if (tempC <= 0) return '#1E40AF'; // Deep blue
    if (tempC <= 10) return '#3B82F6'; // Blue
    if (tempC <= 20) return '#06B6D4'; // Cyan
    if (tempC <= 30) return '#10B981'; // Green
    if (tempC <= 35) return '#F59E0B'; // Yellow
    if (tempC <= 40) return '#F97316'; // Orange
    return '#DC2626'; // Red
  }
  
  function getHumidityColor(humidity) {
    if (humidity <= 30) return '#F59E0B'; // Yellow (dry)
    if (humidity <= 60) return '#10B981'; // Green (comfortable)
    return '#3B82F6'; // Blue (humid)
  }
  
  function getPressureColor(pressure) {
    if (pressure < 1000) return '#DC2626'; // Red (low pressure)
    if (pressure < 1020) return '#10B981'; // Green (normal)
    return '#3B82F6'; // Blue (high pressure)
  }
  
  function createWindArrow(lat, lon, direction, speed) {
    const L = window.L;
    
    // Calculate arrow end point based on wind direction and speed
    const distance = Math.min(speed * 1000, 20000); // Scale distance based on wind speed
    const radians = (direction - 90) * Math.PI / 180; // Convert to radians and adjust for map orientation
    
    const endLat = lat + (distance / 111000) * Math.cos(radians); // Rough conversion
    const endLon = lon + (distance / (111000 * Math.cos(lat * Math.PI / 180))) * Math.sin(radians);
    
    const windColor = speed > 20 ? '#DC2626' : speed > 10 ? '#F59E0B' : '#10B981';
    
    // Create arrow polyline
    const arrow = L.polyline([
      [lat, lon],
      [endLat, endLon]
    ], {
      color: windColor,
      weight: 4,
      opacity: 0.8
    });
    
    // Add arrowhead
    const arrowHead = L.circle([endLat, endLon], {
      color: windColor,
      fillColor: windColor,
      fillOpacity: 1,
      radius: 2000,
      weight: 2
    });
    
    // Group arrow parts
    const windGroup = L.layerGroup([arrow, arrowHead]);
    
    return windGroup;
  }
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {!isReady && (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p>Loading interactive map...</p>
        </div>
      )}
      <div 
        ref={mapRef}
        className="h-full w-full rounded-lg"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}

