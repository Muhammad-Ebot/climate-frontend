import React from 'react';

const About = () => {
  return (
    <div>
      {/* About Section */}
      <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">About</h2>
          <p className="text-gray-700 leading-relaxed">
            This platform combines 24 years of historical weather data with cutting-edge 
            machine learning models to provide early warnings for extreme weather events. 
            Our goal is to support disaster preparedness, agriculture planning, and climate 
            resilience by offering accurate and accessible insights to researchers, 
            policymakers, and the general public.
          </p>
        </section>
    </div>
  );
};

export default About;

export const metadata = {
  title: "About-Climatrix",
  description: "About Climatrix Application",
};