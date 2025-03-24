import React, { useState, useEffect } from 'react';
import NoteEditor from '../components/notes/NoteEditor';
import EmptyState from '../components/notes/EmptyState';
import PinnedNotes from '../components/notes/PinnedNotes';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/notes/NoteCard';

function NotesPage() {
  const { notes, loading, error, createNote, updateNote, deleteNote, toggleArchive, togglePin, moveNoteToBin, toggleTrash } = useNotes();
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Filter notes by pinned status & Delete
  const pinnedNotes = notes.filter(note => note.is_pinned && !note.deletedAt);
  const unpinnedNotes = notes.filter(note => !note.is_pinned && !note.deletedAt);
  
  // Handle new note creation
  const handleNoteCreate = async (noteData) => {
    try {
      await createNote(noteData);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  // Handle note update
  const handleNoteUpdate = async (id, noteData) => {
    try {
      await updateNote(id, noteData);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  // Handle note deletion
  const handleNoteDelete = async (id) => {
    try {
      await toggleTrash(id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  // Handle pin toggle
  const handlePinToggle = async (id) => {
    try {
      await togglePin(id);
    } catch (error) {
      console.error('Failed to toggle pin status:', error);
    }
  };

  // Handle archive toggle
  const handleArchiveToggle = async (id) => {
    try {
      await toggleArchive(id);
    } catch (error) {
      console.error('Failed to toggle archive status:', error);
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
      {/* Note editor for creating new notes */}
      <NoteEditor onSave={handleNoteCreate} />
      
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
      
      {/* Display pinned notes */}
      {!loading && pinnedNotes.length > 0 && (
        <div className="mt-6">
          <PinnedNotes notes={pinnedNotes.map(note => ({
            ...note,
            onUpdate: (data) => handleNoteUpdate(note.id, data),
            onDelete: () => handleNoteDelete(note.id),
            onArchive: () => handleArchiveToggle(note.id),
            onPin: () => handlePinToggle(note.id)
          }))} />
        </div>
      )}
      
      {/* Display unpinned notes */}
      {!loading && unpinnedNotes.length > 0 && (
        <div className="mt-6">
          {pinnedNotes.length > 0 && (
            <div className="text-xs font-medium text-gray-500 tracking-wide mb-2 px-2">
              OTHERS
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unpinnedNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={{
                  ...note,
                  onUpdate: (data) => handleNoteUpdate(note.id, data),
                  onDelete: () => handleNoteDelete(note.id),
                  onArchive: () => handleArchiveToggle(note.id),
                  onPin: () => handlePinToggle(note.id)
                }} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Display empty state */}
      {!loading && notes.length === 0 && <EmptyState />}
    </div>
  );
}

export default NotesPage;