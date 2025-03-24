// src/pages/EditLabelsPage.jsx
import React, { useState } from 'react';

function EditLabelsPage() {
  const [labels, setLabels] = useState(['Personal', 'Work', 'Ideas']);
  const [newLabel, setNewLabel] = useState('');

  const addLabel = () => {
    if (newLabel.trim() !== '') {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const deleteLabel = (index) => {
    const updatedLabels = [...labels];
    updatedLabels.splice(index, 1);
    setLabels(updatedLabels);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium text-gray-800 mb-4">Edit Labels</h1>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Create new label"
            className="px-3 py-2 border border-gray-300 rounded-md w-64 mr-2"
            onKeyDown={(e) => e.key === 'Enter' && addLabel()}
          />
          <button 
            onClick={addLabel}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z"></path>
              </svg>
              <span>{label}</span>
            </div>
            <button 
              onClick={() => deleteLabel(index)}
              className="text-gray-500 hover:text-red-500"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditLabelsPage;