import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current path or default to notes
  const currentPath = location.pathname === '/' ? '/notes' : location.pathname;
  const activeSection = currentPath.substring(1); // Remove leading slash
  
  const sidebarItems = [
    {
      id: 'notes',
      label: 'Notes',
      path: '/notes',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"></path>
        </svg>
      ),
    },
    {
      id: 'reminders',
      label: 'Reminders',
      path: '/reminders',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>
        </svg>
      ),
    },
    {
      id: 'editlabels',
      label: 'Edit labels',
      path: '/editlabels',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L3 16.82V21h4.18L20.41 7.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path>
        </svg>
      ),
    },
    {
      id: 'archive',
      label: 'Archive',
      path: '/archive',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"></path>
        </svg>
      ),
    },
    {
      id: 'bin',
      label: 'Bin',
      path: '/bin',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z"></path>
        </svg>
      ),
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div 
      className={`fixed sm:relative h-full mt-5 bg-white overflow-y-auto flex flex-col shadow-lg
        w-16 sm:w-16 md:w-72
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 z-20`}
    >
      <nav className="flex-grow">
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-center md:justify-start w-full px-2 md:px-7 py-3 text-sm text-left cursor-pointer ${
              activeSection === item.id
                ? 'bg-yellow-500 rounded-r-full font-medium'
                : 'hover:bg-gray-100 hover:rounded-r-full'
            }`}
            onClick={() => handleNavigation(item.path)}
            title={item.label}
          >
            <span className="md:mr-8">{item.icon}</span>
            <span className="hidden md:inline text-[#202124] font-medium">{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="px-3 md:px-6 pb-4 mt-4 text-center md:text-left">
        <span className="hidden md:inline text-xs text-[#5f6368] cursor-pointer hover:text-[#1a73e8]">
          Open-source licences
        </span>
      </div>
    </div>
  );
}

export default Sidebar;