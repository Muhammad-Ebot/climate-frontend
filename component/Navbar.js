//component/Navbar.js
import React from 'react';
import Link from 'next/link';
import ClimatrixLogo from './ClimatrixLogo';


const Navbar = () => {
  return (
    
      <nav className='flex justify-between  bg-gray-500 text-white'>
        <div><ClimatrixLogo width={200} height={100} /></div>
        <ul className='flex gap-6 px-4 py-8'>
            <Link href="/"><li>Home</li></Link>
            <Link href="/about"><li>About</li></Link>
            <Link href="/weatherdata"><li>Weather Data</li></Link>
            <Link href="/contact"><li>Contact</li></Link>
        </ul>
      </nav>
    
  );
};

export default Navbar;