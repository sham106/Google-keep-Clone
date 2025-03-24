// src/pages/BinPage.jsx
import React, { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/notes/NoteCard';

function BinPage() {
  const { notes, loading, error, deleteNote, restoreFromTrash, emptyTrash } = useNotes('trash');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false);

  // Handle permanent deletion
  const handlePermanentDelete = async (id) => {
    try {
      await deleteNote(id);
    } catch (error) {
      console.error('Failed to permanently delete note:', error);
    }
  };

  // Handle restore from trash
  const handleRestore = async (id) => {
    try {
      await restoreFromTrash(id);
    } catch (error) {
      console.error('Failed to restore note:', error);
    }
  };

  // Handle empty trash
  const handleEmptyTrash = async () => {
    try {
      setIsEmptyingTrash(true);
      await emptyTrash();
    } catch (error) {
      console.error('Failed to empty trash:', error);
    } finally {
      setIsEmptyingTrash(false);
    }
  };

  // Close any open menu when clicking outside
  const handlePageClick = () => {
    if (activeMenuId) {
      setActiveMenuId(null);
    }
  };

  // Custom note component for trash view
  const TrashNoteCard = ({ note }) => {
    return (
      <NoteCard
        note={{
          ...note,
          onUpdate: null, // No editing in trash
          onDelete: () => handlePermanentDelete(note.id),
          onRestore: () => handleRestore(note.id),
          inTrash: true
        }}
      />
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" onClick={handlePageClick}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium text-gray-800">Bin</h1>
        {notes.length > 0 && (
          <button 
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
            onClick={handleEmptyTrash}
            disabled={isEmptyingTrash}
          >
            {isEmptyingTrash ? 'Emptying...' : 'Empty Bin'}
          </button>
        )}
      </div>
      
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
      
      {/* Display trashed notes */}
      {!loading && notes.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {notes.map(note => (
              <TrashNoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
      
      {/* Display empty state */}
      {!loading && notes.length === 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z"></path>
            </svg>
            <p className="text-lg">No notes in Bin</p>
            <p className="mt-2">Notes in Bin will be automatically deleted after 7 days</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BinPage;