import React, { useState, useRef, useEffect } from 'react';

function NoteCard({ note }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title || '');
  const [editedContent, setEditedContent] = useState(note.content || '');
  const menuRef = useRef(null);
  const noteRef = useRef(null);
  const titleInputRef = useRef(null);

  // Extract actions from note props
  const { onUpdate, onDelete, onArchive, onPin } = note;
  
  // Determine if note is in trash
  const isInTrash = note.hasOwnProperty('deletedAt');

  useEffect(() => {
    // Add click outside listener for menu
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    
    // Add click outside listener for editing mode
    function handleClickOutsideNote(event) {
      if (isEditing && noteRef.current && !noteRef.current.contains(event.target)) {
        handleSaveNote();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutsideNote);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutsideNote);
    };
  }, [isEditing]);

  useEffect(() => {
    // Focus title input when entering edit mode
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  // Generate color class based on note color
  const getColorClass = (color) => {
    switch (color) {
      case 'red': return 'bg-red-50 hover:bg-red-100 border-red-200';
      case 'orange': return 'bg-orange-50 hover:bg-orange-100 border-orange-200';
      case 'yellow': return 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200';
      case 'green': return 'bg-green-50 hover:bg-green-100 border-green-200';
      case 'blue': return 'bg-blue-50 hover:bg-blue-100 border-blue-200';
      case 'purple': return 'bg-purple-50 hover:bg-purple-100 border-purple-200';
      case 'gray': return 'bg-gray-50 hover:bg-gray-100 border-gray-200';
      default: return 'bg-white hover:bg-gray-50 border-gray-200';
    }
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
    setShowMenu(false);
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    if (onPin) onPin();
  };

  const handleArchiveClick = (e) => {
    e.stopPropagation();
    if (onArchive) onArchive();
  };

  const handleNoteClick = () => {
    // Only allow editing for notes not in trash
    if (!isEditing && !isInTrash && onUpdate) {
      setIsEditing(true);
      setEditedTitle(note.title || '');
      setEditedContent(note.content || '');
    }
  };

  const handleSaveNote = () => {
    setIsEditing(false);
    if (onUpdate && editedTitle !== note.title || editedContent !== note.content) {
      onUpdate({ 
        ...note, 
        title: editedTitle, 
        content: editedContent 
      });
    }
  };

  return (
    <div ref={noteRef}>
      {!isEditing ? (
        // View mode
        <div 
          className={`border rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-200 ${getColorClass(note.color)}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            if (!showMenu) {
              setShowMenu(false);
            }
          }}
          onClick={isInTrash ? undefined : handleNoteClick}
        >
          {note.title && (
            <div className="px-5 pt-4 pb-2 font-bold text-gray-800">{note.title}</div>
          )}
          <div className="px-5 pb-4 whitespace-pre-wrap text-gray-700">
            {note.content && note.content.split('\n').map((line, i) => (
              <div key={i} className="mb-1">{line || '\u00A0'}</div>
            ))}
          </div>
          
          {/* Icon toolbar - visible only on hover */}
          <div 
            className={`flex p-2 px-3 border-t border-opacity-50 space-x-2 transition-opacity duration-150 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* If in trash, show restore button instead of reminder */}
            {isInTrash ? (
              <button 
                className="p-1.5 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                onClick={handleArchiveClick}
                title="Restore note"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14zM6 7v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm8 7v4h-4v-4H8l4-4 4 4h-2z" />
                </svg>
              </button>
            ) : (
              <button className="p-1.5 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" />
                </svg>
              </button>
            )}
            
            {/* Pin/Unpin button - only show if not in trash */}
            {!isInTrash && (
              <button 
                className="p-1.5 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                onClick={handlePinClick}
                title={note.is_pinned ? "Unpin note" : "Pin note"}
              >
                <svg className={`w-4 h-4 ${note.is_pinned ? 'text-yellow-600' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zM9 4v7.75L7.5 14h9L15 11.75V4H9z" />
                </svg>
              </button>
            )}
            
            {/* Archive/Delete button - change based on if note is in trash */}
            <button 
              className="p-1.5 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              onClick={isInTrash ? handleDeleteClick : handleArchiveClick}
              title={isInTrash ? "Delete permanently" : "Archive note"}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                {isInTrash ? (
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                ) : (
                  <path d="M20.54 5.23L19.15 3.55C18.88 3.21 18.47 3 18 3H6C5.53 3 5.12 3.21 4.84 3.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V6.5C21 6.02 20.83 5.57 20.54 5.23ZM6.24 5H17.76L18.59 6H5.42L6.24 5ZM5 19V8H19V19H5Z" />
                )}
              </svg>
            </button>
            
            {/* More options - only show if not in trash */}
            {!isInTrash && (
              <div className="relative ml-auto" ref={menuRef}>
                <button 
                  className="p-1.5 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={handleMenuToggle}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                {showMenu && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={handleDeleteClick}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                      Delete note
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z"/>
                      </svg>
                      Add label
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                      Make a copy
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                      </svg>
                      Change color
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Edit mode
        <div 
          className={`border rounded-lg overflow-hidden shadow-lg ${getColorClass(note.color)}`}
        >
          <div className="p-4">
            <input
              ref={titleInputRef}
              className="w-full mb-2 font-bold text-gray-800 bg-transparent border-none outline-none placeholder-gray-500"
              placeholder="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="w-full min-h-[100px] text-gray-700 bg-transparent border-none outline-none resize-none placeholder-gray-500"
              placeholder="Take a note..."
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </div>
          
          <div className="flex p-2 px-3 border-t border-opacity-50">
            {/* Reminder icon */}
            <button className="p-1.5 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" />
              </svg>
            </button>
            
            {/* Pin/Unpin button */}
            <button 
              className="p-1.5 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              onClick={handlePinClick}
              title={note.is_pinned ? "Unpin note" : "Pin note"}
            >
              <svg className={`w-4 h-4 ${note.is_pinned ? 'text-yellow-600' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zM9 4v7.75L7.5 14h9L15 11.75V4H9z" />
              </svg>
            </button>
            
            {/* Archive button */}
            <button 
              className="p-1.5 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              onClick={handleArchiveClick}
              title="Archive note"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.54 5.23L19.15 3.55C18.88 3.21 18.47 3 18 3H6C5.53 3 5.12 3.21 4.84 3.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V6.5C21 6.02 20.83 5.57 20.54 5.23ZM6.24 5H17.76L18.59 6H5.42L6.24 5ZM5 19V8H19V19H5Z" />
              </svg>
            </button>
            
            <div className="ml-auto">
              <button 
                className="px-4 py-1.5 text-sm text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                onClick={handleSaveNote}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteCard;