import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotesPage from '../../pages/NotesPage';
import RemindersPage from '../../pages/RemindersPage';
import EditLabelsPage from '../../pages/EditLabelsPage';
import ArchivePage from '../../pages/ArchivePage';
import BinPage from '../../pages/BinPage';

function MainContent() {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <Routes>
        <Route index element={<NotesPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="editlabels" element={<EditLabelsPage />} />
        <Route path="archive" element={<ArchivePage />} />
        <Route path="bin" element={<BinPage />} />
      </Routes>
    </main>
  );
}

export default MainContent;