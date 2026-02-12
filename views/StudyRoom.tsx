
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Subject, Explanation } from '../types';
import { explainConcept } from '../geminiService';
import { 
  Book, 
  Search, 
  Sparkles, 
  ListChecks, 
  Compass, 
  Loader2,
  AlertCircle
} from 'lucide-react';

const subjects = Object.values(Subject);

const StudyRoom: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subject, setSubject] = useState<Subject>((searchParams.get('subject') as Subject) || Subject.PHYSICS);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [error, setError] = useState('');

  const handleLearn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const data = await explainConcept(subject, topic);
      setExplanation(data);
    } catch (err) {
      setError("I couldn't find a good explanation for that topic. Try being more specific!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
              <Compass size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Interactive Concept Finder</h1>
              <p className="text-slate-500">Master any O-Level topic using systematic analogies.</p>
            </div>
          </div>

          <form onSubmit={handleLearn} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Subject</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Topic / Concept</label>
                <input 
                  type="text"
                  placeholder="e.g. Newton's 2nd Law, Osmosis, or Stoichiometry"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Instructor is thinking...</>
              ) : (
                <><Search size={20} /> Explain it with Analogies</>
              )}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-6 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 animate-slideUp">
          <AlertCircle className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {explanation && !loading && (
        <div className="space-y-8 animate-slideUp">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <div className="bg-indigo-600 p-8 text-white relative">
              <h2 className="text-3xl font-extrabold mb-2">{explanation.topic}</h2>
              <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-indigo-400/30">
                <Book size={16} /> O-Level Syllabus Mastered
              </div>
              <Sparkles className="absolute right-8 top-8 text-indigo-400 opacity-40 w-16 h-16" />
            </div>
            
            <div className="p-8 space-y-8">
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                  The Concept
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {explanation.concept}
                </p>
              </section>

              <section className="bg-amber-50 rounded-2xl p-6 border border-amber-100 relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={24} />
                    Easy-to-Remember Analogy
                  </h3>
                  <p className="text-amber-800 text-lg leading-relaxed italic">
                    "{explanation.analogy}"
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform">
                   <LightbulbIcon size={120} />
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ListChecks className="text-indigo-500" size={24} />
                    Key Exam Points
                  </h3>
                  <ul className="space-y-3">
                    {explanation.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-3 text-slate-600">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">{i+1}</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Instructor's Practice Tip</h3>
                  <p className="text-slate-600 italic">
                    {explanation.practiceHint}
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LightbulbIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" /><path d="M10 22h4" />
  </svg>
);

export default StudyRoom;
