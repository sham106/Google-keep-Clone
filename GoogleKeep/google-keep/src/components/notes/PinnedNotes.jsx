import React from 'react';
import NoteCard from './NoteCard';

function PinnedNotes({ notes }) {
  return (
    <div className="mb-10">
      <div className="text-xs font-medium text-gray-500 tracking-wide mb-2 px-2">
        PINNED
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

export default PinnedNotes;