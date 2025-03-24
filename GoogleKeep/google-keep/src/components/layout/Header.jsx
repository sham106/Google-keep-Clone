import React, { useState, useEffect } from 'react';

function Header({ onMenuClick }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
        console.log('Scrolled down, adding shadow');
      } else {
        setIsScrolled(false);
        console.log('Scrolled to top, removing shadow');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`flex items-center px-4 py-2 border-b border-gray-200 w-full bg-white sticky top-0 z-10 ${isScrolled ? 'shadow-md' : ''}`}>
      <button 
        onClick={onMenuClick}
        className="p-3 rounded-full hover:bg-gray-100 focus:outline-none mr-1"
        aria-label="Main menu"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div className="flex items-center">
        <div className="w-10 h-10 mr-1 bg-yellow-400 flex items-center justify-center rounded-lg">
          <svg className="w-6 h-6 text-yellow-800" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
          </svg>
        </div>
        <span className="text-xl font-normal text-gray-700 ml-1">Keep</span>
      </div>
      
      <div className="flex-1 mx-4">
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center bg-gray-100 rounded-lg py-2 px-4 hover:bg-gray-200 hover:shadow-sm focus-within:shadow-md focus-within:bg-white">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent px-3 py-1 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Refresh icon */}
        <button className="p-3 rounded-full hover:bg-gray-100 focus:outline-none" aria-label="Refresh">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        {/* List/Grid view toggle */}
        <button className="p-3 rounded-full hover:bg-gray-100 focus:outline-none" aria-label="List view">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        
        {/* Settings icon */}
        <button className="p-3 rounded-full hover:bg-gray-100 focus:outline-none" aria-label="Settings">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        {/* Profile avatar - using teal circle like in the screenshot */}
        <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center">
          <span className="text-sm font-medium">S</span>
        </div>
      </div>
    </header>
  );
}

export default Header;