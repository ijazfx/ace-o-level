
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Subject, UserProfile } from '../types';
import { 
  Atom, 
  Beaker, 
  Dna, 
  Calculator, 
  Cpu, 
  Play, 
  BookOpenText,
  Clock,
  Trophy,
  GraduationCap,
  Target,
  BarChart3,
  Flame
} from 'lucide-react';

const subjectsList = [
  { id: Subject.PHYSICS, icon: Atom, color: 'text-blue-600', bg: 'bg-blue-100', topics: ['Forces', 'Energy', 'Waves', 'Electricity'] },
  { id: Subject.CHEMISTRY, icon: Beaker, color: 'text-emerald-600', bg: 'bg-emerald-100', topics: ['Atomic Structure', 'Stoichiometry', 'Organic Chem'] },
  { id: Subject.BIOLOGY, icon: Dna, color: 'text-rose-600', bg: 'bg-rose-100', topics: ['Cell Structure', 'Enzymes', 'Genetics'] },
  { id: Subject.MATHEMATICS, icon: Calculator, color: 'text-violet-600', bg: 'bg-violet-100', topics: ['Algebra', 'Trigonometry', 'Calculus'] },
  { id: Subject.COMPUTER_SCIENCE, icon: Cpu, color: 'text-amber-600', bg: 'bg-amber-100', topics: ['Algorithms', 'Logic Gates', 'Hardware'] },
];

const Dashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();
  const stats = user.stats;
  
  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            You've completed {stats.examsCompleted} exam papers so far. Keep pushing for that A*!
          </p>
        </div>
      </header>

      {/* Progress Report Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <Target size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Accuracy</div>
            <div className="text-2xl font-black text-slate-900">{accuracy}%</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Marks</div>
            <div className="text-2xl font-black text-slate-900">{stats.totalCorrect}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-rose-100 p-3 rounded-xl text-rose-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Questions Solved</div>
            <div className="text-2xl font-black text-slate-900">{stats.totalQuestions}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <Flame size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exams Finished</div>
            <div className="text-2xl font-black text-slate-900">{stats.examsCompleted}</div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectsList.map((subj) => (
          <div key={subj.id} className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`${subj.bg} ${subj.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                <subj.icon size={28} />
              </div>
              <div className="flex gap-2">
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                   {stats.subjectAttempts[subj.id] || 0} Attempts
                 </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">{subj.id}</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {subj.topics.slice(0, 3).map(t => (
                <span key={t} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => navigate(`/practice/${subj.id}`)}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Play size={18} /> Practice
              </button>
              <button 
                onClick={() => navigate(`/study?subject=${subj.id}`)}
                className="flex items-center justify-center p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                title="Learn Concepts"
              >
                <BookOpenText size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-2xl font-bold">Smart AI Tutor Tip 💡</h2>
            <p className="text-indigo-100 leading-relaxed italic text-lg">
              "Think of momentum like a heavy truck rolling down a hill. Even if it's moving slowly, it's hard to stop because of its huge mass. That's why p = mv!"
            </p>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Clock size={16} /> 20m Daily helps retention
              </div>
              <div className="flex items-center gap-1.5">
                <Target size={16} /> Consistency is Key
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <GraduationCap size={120} className="text-indigo-400 opacity-30" />
          </div>
        </div>
        
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>
      </section>
    </div>
  );
};

export default Dashboard;
