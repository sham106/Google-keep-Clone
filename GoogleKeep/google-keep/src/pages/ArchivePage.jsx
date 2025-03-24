// src/pages/ArchivePage.jsx
import React, { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/notes/NoteCard';

function ArchivePage() {
  const { notes, loading, error, updateNote, toggleArchive, toggleTrash } = useNotes('archive');
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Handle note update
  const handleNoteUpdate = async (id, noteData) => {
    try {
      await updateNote(id, noteData);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  // Handle unarchive
  const handleUnarchive = async (id) => {
    try {
      await toggleArchive(id);
    } catch (error) {
      console.error('Failed to unarchive note:', error);
    }
  };

  // Handle move to trash
  const handleMoveToTrash = async (id) => {
    try {
      await toggleTrash(id);
    } catch (error) {
      console.error('Failed to move note to trash:', error);
    }
  };

  // Close any open menu when clicking outside
  const handlePageClick = () => {
    if (activeMenuId) {
      setActiveMenuId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" onClick={handlePageClick}>
      <h1 className="text-2xl font-medium text-gray-800 mb-4">Archive</h1>
      
      {/* Display loading state */}
      {loading && (
        <div className="flex justify-center mt-6">
          <div className="text-gray-500">Loading notes...</div>
        </div>
      )}
      
      {/* Display error state */}
      {error && (
        <div className="flex justify-center mt-6">
          <div className="text-red-500">Error: {error}</div>
        </div>
      )}
      
      {/* Display archived notes */}
      {!loading && notes.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {notes.map(note => (
              <NoteCard 
                key={note.id} 
                note={{
                  ...note,
                  onUpdate: (data) => handleNoteUpdate(note.id, data),
                  onDelete: () => handleMoveToTrash(note.id),
                  onArchive: () => handleUnarchive(note.id),
                  isArchived: true
                }} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Display empty state */}
      {!loading && notes.length === 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"></path>
            </svg>
            <p className="text-lg">Your archived notes appear here</p>
            <p className="mt-2">Notes you archive will be hidden from the main view and stored here</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArchivePage;