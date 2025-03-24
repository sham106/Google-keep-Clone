
import React, { createContext, useState, useContext, useEffect } from 'react';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load notes from localStorage on initial render
  useEffect(() => {
    try {
      const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
      setNotes(savedNotes);
      setLoading(false);
    } catch (err) {
      setError('Failed to load notes');
      setLoading(false);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes, loading]);

  // Create a new note
  const createNote = (noteData) => {
    const newNote = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      is_pinned: false,
      is_archived: false,
      ...noteData
    };
    
    setNotes((prevNotes) => [...prevNotes, newNote]);
    return newNote;
  };

  // Update an existing note
  const updateNote = (id, noteData) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => 
        note.id === id 
          ? { 
              ...note, 
              ...noteData, 
              updatedAt: new Date().toISOString() 
            } 
          : note
      )
    );
  };

  // Move note to bin (soft delete)
  const moveNoteToBin = (id) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => 
        note.id === id 
          ? { 
              ...note, 
              is_pinned: false,
              is_archived: false,
              deletedAt: new Date().toISOString(),
            } 
          : note
      )
    );
  };

  // Restore note from bin
  const restoreFromBin = (id) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => 
        note.id === id 
          ? { 
              ...note,
              deletedAt: undefined,
              updatedAt: new Date().toISOString()
            } 
          : note
      )
    );
  };

  // Delete note permanently
  const deleteNotePermanently = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  // Empty bin (delete all bin notes permanently)
  const emptyBin = () => {
    setNotes((prevNotes) => prevNotes.filter((note) => !note.deletedAt));
  };

  // Toggle archive status
  const toggleArchive = (id) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => 
        note.id === id 
          ? { 
              ...note, 
              is_archived: !note.is_archived,
              // If being archived, remove from pinned
              is_pinned: note.is_archived ? note.is_pinned : false,
              deletedAt: undefined,
              updatedAt: new Date().toISOString() 
            } 
          : note
      )
    );
  };

  // Toggle pin status
  const togglePin = (id) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => 
        note.id === id 
          ? { 
              ...note, 
              is_pinned: !note.is_pinned,
              updatedAt: new Date().toISOString() 
            } 
          : note
      )
    );
  };

  return (
    <NotesContext.Provider 
      value={{ 
        notes,
        loading,
        error,
        createNote,
        updateNote,
        moveNoteToBin,
        restoreFromBin,
        deleteNotePermanently,
        emptyBin,
        toggleArchive,
        togglePin
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use the notes context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};