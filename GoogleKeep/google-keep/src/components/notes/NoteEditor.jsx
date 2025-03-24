import React, { useState, useRef, useEffect } from 'react';

function NoteEditor({ onSave, initialNote = null, onClose = () => {} }) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [color, setColor] = useState(initialNote?.color || 'white');
  const [isPinned, setIsPinned] = useState(initialNote?.is_pinned || false);
  const [expanded, setExpanded] = useState(!!initialNote);
  const [showColorPalette, setShowColorPalette] = useState(false);
  
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const editorRef = useRef(null);

  const colorOptions = [
    { name: 'white', class: 'bg-white' },
    { name: 'red', class: 'bg-red-50' },
    { name: 'orange', class: 'bg-orange-50' },
    { name: 'yellow', class: 'bg-yellow-50' },
    { name: 'green', class: 'bg-green-50' },
    { name: 'blue', class: 'bg-blue-50' },
    { name: 'purple', class: 'bg-purple-50' },
    { name: 'gray', class: 'bg-gray-50' },
  ];

  // Handle outside clicks to close the editor
  useEffect(() => {
    function handleClickOutside(event) {
      if (expanded && editorRef.current && !editorRef.current.contains(event.target)) {
        handleSave();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded, title, content, color, isPinned]);

  useEffect(() => {
    if (expanded && titleRef.current) {
      titleRef.current.focus();
    }
  }, [expanded]);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleSave = () => {
    // Only save if there's content
    if (title.trim() || content.trim()) {
      onSave({
        title,
        content,
        color,
        is_pinned: isPinned
      });
      
      // Clear the editor if this is a new note
      if (!initialNote) {
        setTitle('');
        setContent('');
        setColor('white');
        setIsPinned(false);
      }
    }
    
    // Close the editor if editing an existing note
    if (initialNote) {
      onClose();
    } else {
      setExpanded(false);
    }
    
    setShowColorPalette(false);
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const handleColorSelect = (colorName) => {
    setColor(colorName);
    setShowColorPalette(false);
  };

  return (
    <div 
      ref={editorRef}
      className={`${colorOptions.find(c => c.name === color).class} rounded-lg shadow-md overflow-hidden w-full max-w-lg mx-auto relative ${expanded ? 'border border-gray-200' : 'cursor-pointer'}`}
      onClick={!expanded ? handleExpand : undefined}
    >
      <div className="p-3">
        {expanded && (
          <input
            ref={titleRef}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-base font-bold outline-none mb-2 bg-transparent"
          />
        )}
        <textarea
          ref={contentRef}
          placeholder="Take a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full text-sm outline-none resize-none bg-transparent"
          rows={expanded ? 4 : 1}
          onFocus={handleExpand}
        />
      </div>

      {/* Icons bar - only show in expanded mode */}
      {expanded && (
        <div className="flex items-center justify-between px-2 py-2 border-t border-gray-100">
          <div className="flex space-x-1">
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" />
              </svg>
            </button>
            
            {/* Pin button */}
            <button 
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
              onClick={togglePin}
            >
              <svg className={`w-5 h-5 ${isPinned ? 'text-yellow-600' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zM9 4v7.75L7.5 14h9L15 11.75V4H9z" />
              </svg>
            </button>
            
            {/* Color palette button */}
            <div className="relative">
              <button 
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
                onClick={() => setShowColorPalette(!showColorPalette)}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.83 21 13.5 20.33 13.5 19.5C13.5 19.11 13.35 18.76 13.11 18.5C12.88 18.23 12.73 17.88 12.73 17.5C12.73 16.67 13.4 16 14.23 16H16C18.76 16 21 13.76 21 11C21 6.58 16.97 3 12 3ZM6.5 12C5.67 12 5 11.33 5 10.5C5 9.67 5.67 9 6.5 9C7.33 9 8 9.67 8 10.5C8 11.33 7.33 12 6.5 12ZM9.5 8C8.67 8 8 7.33 8 6.5C8 5.67 8.67 5 9.5 5C10.33 5 11 5.67 11 6.5C11 7.33 10.33 8 9.5 8ZM14.5 8C13.67 8 13 7.33 13 6.5C13 5.67 13.67 5 14.5 5C15.33 5 16 5.67 16 6.5C16 7.33 15.33 8 14.5 8ZM17.5 12C16.67 12 16 11.33 16 10.5C16 9.67 16.67 9 17.5 9C18.33 9 19 9.67 19 10.5C19 11.33 18.33 12 17.5 12Z" />
                </svg>
              </button>
              
              {/* Color palette dropdown */}
              {showColorPalette && (
                <div className="absolute left-0 bottom-full mb-2 p-1 bg-white rounded-md shadow-lg z-10 flex flex-wrap w-48">
                  {colorOptions.map((option) => (
                    <button
                      key={option.name}
                      className={`w-8 h-8 m-1 rounded-full ${option.class} border border-gray-200 hover:border-gray-400`}
                      onClick={() => handleColorSelect(option.name)}
                      title={option.name}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Archive button */}
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.54 5.23L19.15 3.55C18.88 3.21 18.47 3 18 3H6C5.53 3 5.12 3.21 4.84 3.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V6.5C21 6.02 20.83 5.57 20.54 5.23ZM6.24 5H17.76L18.59 6H5.42L6.24 5ZM5 19V8H19V19H5Z" />
              </svg>
            </button>
          </div>
          
          <div>
            <button
              onClick={handleSave}
              className="px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteEditor;