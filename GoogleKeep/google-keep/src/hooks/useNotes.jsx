import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/Api';

export const useNotes = (viewType = 'main') => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine if we're in archive or trash view
  const isArchived = viewType === 'archive';
  const isTrashed = viewType === 'trash';

  // Fetch notes based on view type
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await noteService.getAllNotes(isArchived, isTrashed);
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, [isArchived, isTrashed]);

  // Create a new note
  const createNote = async (noteData) => {
    try {
      const newNote = await noteService.createNote(noteData);
      setNotes(prevNotes => [...prevNotes, newNote]);
      return newNote;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create note');
      console.error('Error creating note:', err);
      throw err;
    }
  };

  // Update an existing note
  const updateNote = async (id, noteData) => {
    try {
      const updatedNote = await noteService.updateNote(id, noteData);
      setNotes(prevNotes => 
        prevNotes.map(note => note.id === id ? updatedNote : note)
      );
      return updatedNote;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update note');
      console.error('Error updating note:', err);
      throw err;
    }
  };

  // Delete a note permanently
  const deleteNote = async (id) => {
    // try {
    //   await noteService.deleteNote(id);
    //   setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    // } catch (err) {
    //   setError(err.response?.data?.error || 'Failed to delete note');
    //   console.error('Error deleting note:', err);
    //   throw err;
    // }
    const noteToDelete = notes.find(note => note.id === noteId);
    if (noteToDelete) {
        setTrash([...trash, noteToDelete]); // Move to trash
        setNotes(notes.filter(note => note.id !== noteId)); // Remove from notes
    }
  };

  // Toggle a note's archive status
  const toggleArchive = async (id) => {
    try {
      const updatedNote = await noteService.toggleArchive(id);
      
      // Remove from current view if it doesn't belong here anymore
      if ((isArchived && !updatedNote.is_archived) || (!isArchived && updatedNote.is_archived)) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      } else {
        // Update the note in the current view
        setNotes(prevNotes => 
          prevNotes.map(note => note.id === id ? updatedNote : note)
        );
      }
      
      return updatedNote;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to toggle archive status');
      console.error('Error toggling archive status:', err);
      throw err;
    }
  };

  // Toggle a note's pin status
  const togglePin = async (id) => {
    try {
      const updatedNote = await noteService.togglePin(id);
      setNotes(prevNotes => 
        prevNotes.map(note => note.id === id ? updatedNote : note)
      );
      return updatedNote;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to toggle pin status');
      console.error('Error toggling pin status:', err);
      throw err;
    }
  };

  // Toggle a note's trash status
  const toggleTrash = async (id) => {
    try {
      const updatedNote = await noteService.toggleTrash(id);
      
      // Remove from current view if it doesn't belong here anymore
      if ((isTrashed && !updatedNote.is_trashed) || (!isTrashed && updatedNote.is_trashed)) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      } else {
        // Update the note in the current view
        setNotes(prevNotes => 
          prevNotes.map(note => note.id === id ? updatedNote : note)
        );
      }
      
      return updatedNote;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to toggle trash status');
      console.error('Error toggling trash status:', err);
      throw err;
    }
  };

  // Restore note from trash
  const restoreFromTrash = async (id) => {
    try {
      const updatedNote = await noteService.restoreFromTrash(id);
      // In trash view, remove the note after restoring
      if (isTrashed) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      }
      return updatedNote;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore note from trash');
      console.error('Error restoring note from trash:', err);
      throw err;
    }
  };

  // Empty the trash
  const emptyTrash = async () => {
    try {
      await noteService.emptyTrash();
      // If we're in trash view, clear all notes
      if (isTrashed) {
        setNotes([]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to empty trash');
      console.error('Error emptying trash:', err);
      throw err;
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleArchive,
    togglePin,
    toggleTrash,
    restoreFromTrash,
    emptyTrash,
  };
};