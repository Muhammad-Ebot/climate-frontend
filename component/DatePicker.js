// components/DateRangePicker.jsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'react-date-range';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronDown, X, Check } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const presets = [
  { value: 'last15days', label: 'Last 15 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' }
];

export default function DateRangePicker({ dateRange, setDateRange }) {
  const [showCalendarStart, setShowCalendarStart] = useState(false);
  const [showCalendarEnd, setShowCalendarEnd] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const calendarStartRef = useRef(null);
  const calendarEndRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close calendars when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarStartRef.current && !calendarStartRef.current.contains(event.target)) {
        setShowCalendarStart(false);
      }
      if (calendarEndRef.current && !calendarEndRef.current.contains(event.target)) {
        setShowCalendarEnd(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handlePresetSelect = (type) => {
    setDropdownOpen(false);
    
    if (type === 'custom') {
      setDateRange({ start: startDate, end: endDate, type });
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

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setDateRange({ start: null, end: null, type: 'custom' });
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }) : 'Select date';
  };

  // Get current preset label
  const getCurrentPresetLabel = () => {
    const preset = presets.find(p => p.value === dateRange?.type);
    return preset ? preset.label : 'Select range';
  };

  // Calculate date range duration
  const calculateDuration = () => {
    if (!startDate || !endDate) return null;
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-100 -mx-10"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
        Date Range
      </h2>

      <div className="space-y-4">
        {/* Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex justify-between items-center w-full border border-gray-300 rounded-md px-3 py-2.5 bg-white cursor-pointer hover:border-blue-400 transition-all"
          >
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-gray-800">{getCurrentPresetLabel()}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
          </div>
          
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200"
              >
                {presets.map(preset => (
                  <div 
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset.value)}
                    className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    {preset.value === dateRange?.type && (
                      <Check className="w-4 h-4 text-blue-600 mr-2" />
                    )}
                    <span className={`${preset.value === dateRange?.type ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {preset.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date Range Inputs */}
        <div className="flex space-x-2">
          <div className="relative flex-1" ref={calendarStartRef}>
            <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
            <div 
              onClick={() => {
                setShowCalendarStart(true);
                setShowCalendarEnd(false);
              }}
              className={`flex items-center border border-gray-300 rounded-md px-3 py-2 ${!startDate ? 'text-gray-400' : 'text-gray-800'} cursor-pointer hover:border-blue-400 transition-all`}
            >
              <CalendarIcon className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm">{formatDate(startDate)}</span>
            </div>

            <AnimatePresence>
              {showCalendarStart && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 mt-1 bg-white shadow-lg rounded-lg border border-gray-200"
                >
                  <div className="p-2 bg-blue-50 rounded-t-lg flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Select Start Date</span>
                    <button 
                      onClick={() => setShowCalendarStart(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <Calendar
                    date={startDate || new Date()}
                    onChange={handleStartDateSelect}
                    maxDate={endDate || new Date()}
                    color="#3B82F6"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="w-8 h-px bg-gray-300"></div>
          </div>

          <div className="relative flex-1" ref={calendarEndRef}>
            <label className="text-xs text-gray-500 mb-1 block">End Date</label>
            <div 
              onClick={() => {
                setShowCalendarEnd(true);
                setShowCalendarStart(false);
              }}
              className={`flex items-center border border-gray-300 rounded-md px-3 py-2 ${!endDate ? 'text-gray-400' : 'text-gray-800'} cursor-pointer hover:border-blue-400 transition-all`}
            >
              <CalendarIcon className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm">{formatDate(endDate)}</span>
            </div>

            <AnimatePresence>
              {showCalendarEnd && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 mt-1 bg-white shadow-lg rounded-lg border border-gray-200"
                >
                  <div className="p-2 bg-blue-50 rounded-t-lg flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Select End Date</span>
                    <button 
                      onClick={() => setShowCalendarEnd(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <Calendar
                    date={endDate || new Date()}
                    onChange={handleEndDateSelect}
                    minDate={startDate || undefined}
                    color="#3B82F6"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Date Range Summary */}
        <AnimatePresence>
          {startDate && endDate && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 rounded-md p-3 flex items-center justify-between"
            >
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  {formatDate(startDate)} — {formatDate(endDate)}
                  {duration && <span className="ml-2 text-blue-600 font-medium">({duration} days)</span>}
                </span>
              </div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={clearDates}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}