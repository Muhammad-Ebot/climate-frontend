// components/DateRangePicker.jsx
"use client";
import { useState } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function DateRangePicker({ dateRange, setDateRange }) {
  const [showCalendarStart, setShowCalendarStart] = useState(false);
  const [showCalendarEnd, setShowCalendarEnd] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateSelect = (date) => {
    setStartDate(date);
    setShowCalendarStart(false);
    setDateRange({
      start: date,
      end: endDate || date, // If end date not set, use start date
      type: 'custom'
    });
  };

  const handleEndDateSelect = (date) => {
    setEndDate(date);
    setShowCalendarEnd(false);
    setDateRange({
      start: startDate || date, // If start date not set, use end date
      end: date,
      type: 'custom'
    });
  };

  const handlePresetSelect = (e) => {
    const type = e.target.value;
    if (type === 'custom') {
      setDateRange({ start: null, end: null, type });
      return;
    }

    const end = new Date();
    const start = new Date();
    
    if (type === 'last15days') {
      start.setDate(start.getDate() - 15);
    } else if (type === 'last30days') {
      start.setDate(start.getDate() - 30);
    } else if (type === 'last90days') {
      start.setDate(start.getDate() - 90);
    }

    setStartDate(start);
    setEndDate(end);
    setDateRange({ start, end, type });
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }) : 'Select date';
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>

      <select
        value={dateRange?.type || 'custom'}
        onChange={handlePresetSelect}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="last15days">Last 15 Days</option>
        <option value="last30days">Last 30 Days</option>
        <option value="last90days">Last 90 Days</option>
        <option value="custom">Custom Range</option>
      </select>

      <div className="flex space-x-2">
        <div className="relative flex-1">
          <div 
            onClick={() => setShowCalendarStart(true)}
            className={`border border-gray-300 rounded px-3 py-2 ${!startDate ? 'text-gray-400' : ''} cursor-pointer text-sm`}
          >
            {formatDate(startDate)}
          </div>

          {showCalendarStart && (
            <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-lg">
              <Calendar
                date={startDate || new Date()}
                onChange={handleStartDateSelect}
                maxDate={endDate || new Date()}
              />
            </div>
          )}
        </div>

        <span className="self-center">to</span>

        <div className="relative flex-1">
          <div 
            onClick={() => setShowCalendarEnd(true)}
            className={`border border-gray-300 rounded px-3 py-2 ${!endDate ? 'text-gray-400' : ''} cursor-pointer text-sm`}
          >
            {formatDate(endDate)}
          </div>

          {showCalendarEnd && (
            <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-lg">
              <Calendar
                date={endDate || new Date()}
                onChange={handleEndDateSelect}
                minDate={startDate || new Date(0)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}