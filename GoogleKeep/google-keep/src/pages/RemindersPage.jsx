// src/pages/RemindersPage.jsx
import React from 'react';

function RemindersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium text-gray-800 mb-4">Reminders</h1>
      <p className="text-gray-600">Reminders will appear here</p>
      
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>
          </svg>
          <p className="text-lg">No reminders yet</p>
          <p className="mt-2">Reminders you add will appear here</p>
        </div>
      </div>
    </div>
  );
}

export default RemindersPage;