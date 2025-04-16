//app/page.js
import Image from "next/image";

export default function Home() {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Climatrix
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            A smart weather intelligence platform designed to detect and predict climate extremes
            such as rainfall, heatwaves, floods, and droughts in real-time — with a special focus
            on Sindh, Pakistan.
          </p>
        </section>
                
        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">What You Can Do Here</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>View real-time predictions for heatwaves, rainfall, droughts, and floods</li>
            <li>Explore historical climate patterns in Sindh and other regions of Pakistan</li>
            <li>Access interactive charts, trends, and visualizations</li>
            <li>Gain insights through AI-powered forecasts and recommendations</li>
          </ul>
        </section>
  
        {/* Call to Action */}
        <section className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-700">
            Ready to explore climate insights? Head over to the Weather Data page to see what's 
            happening — and what might be coming.
          </p>
        </section>
      </div>
    );
  
  
}