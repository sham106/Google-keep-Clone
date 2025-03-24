import React from 'react';

function IconButton({ icon, onClick, tooltip, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full hover:bg-gray-100 text-gray-600 ${className}`}
      title={tooltip}
    >
      {icon}
    </button>
  );
}

export default IconButton;