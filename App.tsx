
import React from 'react';
import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';
import { KeywordProvider } from './contexts/KeywordContext';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';

// Helper to use HashRouter for GitHub Pages compatibility
// or use BrowserRouter with basename if configured
const App: React.FC = () => {
    return (
        <KeywordProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </HashRouter>
        </KeywordProvider>
    );
};

export default App;
