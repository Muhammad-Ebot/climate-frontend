import React from 'react';
import TabsBar from '@/component/TabsBar';

const WeatherData = () => {
  return (
    <div>
    <TabsBar/>
      {/* Call to Action */}
      <section className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-700">
            Ready to explore climate insights? Head over to the Tabs to see what's 
            happening — and what might be coming.
          </p>
        </section>
    </div>
  );
};

export default WeatherData;

export const metadata = {
  title: "Weather Data Climatrix",
  description: "Pakistan Weather Data",
};