//component/PakistanMap.js

"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom colorful marker
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

export default function PakistanMap({ onMapClick, selectedCoords }) {
  const pakistanCenter = [30.3753, 69.3451];

  function MapClickHandler() {
    useMapEvents({
      click: (e) => onMapClick(e),
    });
    return null;
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg" >
      <MapContainer
        center={pakistanCenter}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* Windy-like colorful base layer */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        />

        {/* Optional: Precipitation overlay (like Windy) */}
        <TileLayer
          url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_KEY"
        />

        {selectedCoords && (
          <Marker 
            position={[selectedCoords.lat, selectedCoords.lng]} 
            icon={customIcon}
          />
        )}
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}