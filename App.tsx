
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserProfile, UserStats } from './types';
import Dashboard from './views/Dashboard';
import PracticeSession from './views/PracticeSession';
import StudyRoom from './views/StudyRoom';
import { BookOpen, GraduationCap, LayoutDashboard, UserCircle, Sparkles, ArrowRight } from 'lucide-react';

const INITIAL_STATS: UserStats = {
  totalQuestions: 0,
  totalCorrect: 0,
  examsCompleted: 0,
  subjectAttempts: {}
};

const Navbar = ({ userName }: { userName: string }) => {
  const location = useLocation();
  const isActive = (path: string) => location.hash === `#${path}` || (path === '/' && location.hash === '');

  return (
    <nav className="bg-white border-b border-slate-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors shadow-sm">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                AceOLevel
              </span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <Link to="/" className={`flex items-center gap-1.5 font-medium transition-colors ${isActive('/') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/study" className={`flex items-center gap-1.5 font-medium transition-colors isActive('/study') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>
              <BookOpen size={18} /> Study Room
            </Link>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-700 font-semibold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <UserCircle size={20} className="text-indigo-500" />
              <span className="text-sm">{userName || 'Scholar'}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('aceOLevel_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const newUser: UserProfile = {
      name: nameInput.trim(),
      stats: INITIAL_STATS
    };
    setUser(newUser);
    localStorage.setItem('aceOLevel_user', JSON.stringify(newUser));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl border border-slate-100 space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="inline-flex p-4 bg-indigo-100 text-indigo-600 rounded-3xl mb-2">
              <GraduationCap size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900">Welcome to AceOLevel</h1>
            <p className="text-slate-500 leading-relaxed">
              Your AI-powered systematic companion for mastering O-Level examinations.
            </p>
          </div>

          <form onSubmit={handleOnboarding} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">What should we call you?</label>
              <input 
                type="text"
                autoFocus
                placeholder="Enter your name..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-lg font-medium"
              />
            </div>
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 group"
            >
              Start Learning <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="flex items-center gap-2 justify-center text-xs text-slate-400 font-medium">
            <Sparkles size={14} />
            AI-Powered Analogies • Randomized Practice
          </div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar userName={user.name} />
        <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
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
