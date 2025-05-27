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
        `https://climate-backend-7hx4.onrender.com/predict/predict-rainfall/?latitude=${location.lat}&longitude=${location.lon}&prediction_date=${selectedDate.toISOString().split('T')[0]}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch rainfall data');
      }

      const data = await response.json();
      
      // Updated to match the actual backend response structure
      if (data.status === "success" && data.hourly_predictions) {
        setRainData(data.hourly_predictions);
      } else {
        throw new Error('Invalid response format');
      }
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

        {/* Rainfall Intensity Guide */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span>
            Rainfall Intensity Guide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="flex items-center p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold text-sm">0</span>
              </div>
              <div>
                <div className="font-medium text-green-800">No Rain</div>
                <div className="text-xs text-green-600">&lt; 0.5 mm/hr</div>
                <div className="text-xs text-gray-500">Dry conditions</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <div className="font-medium text-blue-800">Light Rain</div>
                <div className="text-xs text-blue-600">0.5 - 2 mm/hr</div>
                <div className="text-xs text-gray-500">Light drizzle</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-bold text-sm">2</span>
              </div>
              <div>
                <div className="font-medium text-yellow-800">Moderate Rain</div>
                <div className="text-xs text-yellow-600">2 - 6 mm/hr</div>
                <div className="text-xs text-gray-500">Noticeable rain</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-orange-600 font-bold text-sm">3</span>
              </div>
              <div>
                <div className="font-medium text-orange-800">Heavy Rain</div>
                <div className="text-xs text-orange-600">6 - 10 mm/hr</div>
                <div className="text-xs text-gray-500">Significant rainfall</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 font-bold text-sm">4</span>
              </div>
              <div>
                <div className="font-medium text-red-800">Very Heavy</div>
                <div className="text-xs text-red-600">≥ 10 mm/hr</div>
                <div className="text-xs text-gray-500">Extreme rainfall</div>
              </div>
            </div>
          </div>
        </div>

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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          row.rain_category_label?.includes('Very Heavy') || row.rain_category_label?.includes('Extreme') ? 'bg-red-100 text-red-800' :
                          row.rain_category_label?.includes('Heavy') ? 'bg-orange-100 text-orange-800' :
                          row.rain_category_label?.includes('Moderate') ? 'bg-yellow-100 text-yellow-800' :
                          row.rain_category_label?.includes('Light') || row.rain_category_label?.includes('Weak') ? 'bg-blue-100 text-blue-800' :
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
