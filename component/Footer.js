//component/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className='flex justify-around bg-gray-500 text-white py-4'>
        <div className='text-left text-xs'>Copyright @ Climatrix | All right reserved by Climatrix</div>
        <ul className='flex gap-5 text-sm'>
            <a href="/"><li>Home</li></a>
            <a href="/about"><li>About</li></a>
            <a href="/weatherdata"><li>Weather Data</li></a>
            <a href="/contact"><li>Contact</li></a>
        </ul>
    </footer>
    
  );
};

export default Footer;