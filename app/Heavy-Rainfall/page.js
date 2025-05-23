// app/Heavy-Rainfall/page.jsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import LocationSearch from '@/component/LocationSearch';
import TabsBar from '@/component/TabsBar';
import DatePicker from '@/component/DatePicker';


export default function HeavyRainfall() {
  const [location, setLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rainData, setRainData] = useState(null);
  const [gridInfo, setGridInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRainData = useCallback(async () => {
    if (!location || !selectedDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('lat', location.lat);
      params.append('lon', location.lon);
      params.append('date', selectedDate.toISOString().split('T')[0]);

      const response = await fetch(
        `http://localhost:8000/predict/predict-rainfall/?latitude=${location.lat}&longitude=${location.lon}&prediction_date=${selectedDate.toISOString().split('T')[0]}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch rainfall data');
      }

      const data = await response.json();
      setRainData(data.predictions);
      setGridInfo(data.grid_info || `Using nearest grid at (${location.lat.toFixed(5)}, ${location.lon.toFixed(5)})`);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch rainfall data:', err);
    } finally {
      setLoading(false);
    }
  }, [location, selectedDate]);

  useEffect(() => {
    if (location && selectedDate) {
      fetchRainData();
    }
  }, [location, selectedDate, fetchRainData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsBar />
      <div className="max-w-7xl mx-auto px-4 py-8">        
        <h1 className="text-3xl font-bold text-gray-800">Heavy Rainfall Forecast</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-16 mb-6">
          <div className='lg:col-span-2'>
            <LocationSearch location={location} setLocation={setLocation} />
          </div>

          {/* Single Date Picker */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Date</label>
            <input 
              type="date"
              className="border border-gray-300 rounded px-2 py-1 w-full"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">Loading rainfall data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="font-medium">Error loading data:</p>
            <p>{error}</p>
            {location && selectedDate && (
              <button 
                onClick={fetchRainData}
                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {(!location || !selectedDate) && !loading && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-blue-700">
              {!location ? 'Enter location coordinates' : 'Select a date'} to view rainfall forecast.
            </p>
          </div>
        )}

        {gridInfo && (
          <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            {gridInfo}
          </div>
        )}

        {rainData && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                Rainfall Forecast for {selectedDate.toLocaleDateString()}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rain (mm)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rain Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rainData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(row.date).toLocaleString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.rain ?? '0.0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.rain_category_label?.includes('Heavy') ? 'bg-red-100 text-red-800' :
                          row.rain_category_label?.includes('Moderate') ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {row.rain_category_label || 'No rain'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.prediction_confidence ? `${(row.prediction_confidence * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}