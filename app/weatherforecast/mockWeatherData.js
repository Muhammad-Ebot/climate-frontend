export const mockWeatherData = {
    location: {
      name: "Karachi",
      lat: 24.8607,
      lon: 67.0011,
    },
    current: {
      date: "2025-04-16",
      time: "14:00",
      temperature: 32,
      condition: "Mostly Sunny",
      icon: "☀️",
      humidity: 45,
      windSpeed: 18,
      pressure: 1012,
    },
    daily: [
      { day: "Wed", tempMax: 34, tempMin: 26, condition: "Sunny", icon: "☀️" },
      { day: "Thu", tempMax: 33, tempMin: 25, condition: "Cloudy", icon: "☁️" },
      { day: "Fri", tempMax: 31, tempMin: 24, condition: "Partly Cloudy", icon: "⛅" },
      { day: "Sat", tempMax: 30, tempMin: 23, condition: "Rain", icon: "🌧️" },
      { day: "Sun", tempMax: 32, tempMin: 24, condition: "Sunny", icon: "☀️" },
      { day: "Mon", tempMax: 33, tempMin: 25, condition: "Clear", icon: "🌙" },
      { day: "Tue", tempMax: 34, tempMin: 26, condition: "Windy", icon: "🌬️" },
    ],
  };
  