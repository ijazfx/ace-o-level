
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Subject } from './types';
import Dashboard from './views/Dashboard';
import PracticeSession from './views/PracticeSession';
import StudyRoom from './views/StudyRoom';
import { BookOpen, GraduationCap, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.hash.includes(path);

  return (
    <nav className="bg-white border-b border-slate-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                AceOLevel
              </span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/" className={`flex items-center gap-1.5 font-medium transition-colors ${isActive('') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/study" className={`flex items-center gap-1.5 font-medium transition-colors ${isActive('study') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>
              <BookOpen size={18} /> Study Room
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/practice/:subject" element={<PracticeSession />} />
            <Route path="/study" element={<StudyRoom />} />
            <Route path="/study/:subject/:topic" element={<StudyRoom />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
