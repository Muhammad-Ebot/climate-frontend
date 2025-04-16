// components/LocationSearch.jsx
"use client";
import { useState } from 'react';

export default function LocationSearch({ location, setLocation }) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [province, setProvince] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    if (!lat || !lon) {
      alert('Please enter both latitude and longitude');
      return;
    }

    setLocation({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      province: province || null,
      name: province ? `${province} (${lat}, ${lon})` : `Location (${lat}, ${lon})`
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
      <form onSubmit={handleSearch} className="space-y-2">
        <div className="flex space-x-2">
          <input
            type="number"
            step="0.0001"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            step="0.0001"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder="Longitude"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <input
          type="text"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          placeholder="Province (optional)"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
}