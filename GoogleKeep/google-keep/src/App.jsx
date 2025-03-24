import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { NotesProvider } from './context/NotesContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('notes');
  
  console.log("✅ App Component Rendered");
  
  return (
    <AuthProvider>
      <NotesProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <div className="flex flex-col h-screen bg-white font-roboto">
                    <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <div className="flex flex-1 overflow-hidden">
                      <Sidebar
                        isOpen={isSidebarOpen}
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                      />
                      <MainContent />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;