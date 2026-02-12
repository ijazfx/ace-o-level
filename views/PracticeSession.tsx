
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Subject, Question, QuizState, UserProfile } from '../types';
import { generateQuestions } from '../geminiService';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  RefreshCcw, 
  Loader2,
  BrainCircuit,
  Settings2,
  ListOrdered,
  BookOpen,
  Trophy
} from 'lucide-react';

type PracticePhase = 'setup' | 'loading' | 'quiz' | 'result';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const PracticeSession: React.FC = () => {
  const { subject } = useParams<{ subject: Subject }>();
  const navigate = useNavigate();
  
  const [phase, setPhase] = useState<PracticePhase>('setup');
  const [targetTopic, setTargetTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  
  const [quiz, setQuiz] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    showResult: false,
    userAnswers: []
  });

  const startPractice = async () => {
    if (!subject) return;
    setPhase('loading');
    try {
      const qs = await generateQuestions(subject as Subject, questionCount, targetTopic);
      setQuiz({
        questions: qs,
        currentIndex: 0,
        score: 0,
        showResult: false,
        userAnswers: new Array(qs.length).fill(null)
      });
      setPhase('quiz');
    } catch (error) {
      console.error(error);
      setPhase('setup');
    }
  };

  const updateStats = (finalScore: number, totalQs: number) => {
    const saved = localStorage.getItem('aceOLevel_user');
    if (saved) {
      const user: UserProfile = JSON.parse(saved);
      user.stats.totalQuestions += totalQs;
      user.stats.totalCorrect += finalScore;
      user.stats.examsCompleted += 1;
      
      const currentSubj = subject as string;
      user.stats.subjectAttempts[currentSubj] = (user.stats.subjectAttempts[currentSubj] || 0) + 1;
      
      localStorage.setItem('aceOLevel_user', JSON.stringify(user));
      // Trigger a window event to notify other components if needed, 
      // though Dashboard will naturally refresh on navigation.
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (quiz.userAnswers[quiz.currentIndex] !== null) return;

    const newUserAnswers = [...quiz.userAnswers];
    newUserAnswers[quiz.currentIndex] = optionIndex;

    const isCorrect = optionIndex === quiz.questions[quiz.currentIndex].correctAnswer;
    
    setQuiz(prev => ({
      ...prev,
      userAnswers: newUserAnswers,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const nextQuestion = () => {
    if (quiz.currentIndex < quiz.questions.length - 1) {
      setQuiz(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      updateStats(quiz.score, quiz.questions.length);
      setPhase('result');
    }
  };

  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-8 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-8">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white">
              <Settings2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Exam Preparation</h2>
              <p className="text-slate-500">Configure your {subject} practice session</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <BookOpen size={16} className="text-indigo-500" />
                Focus Topic (Optional)
              </label>
              <input 
                type="text"
                placeholder="e.g. Kinematics, Mole Concept, or leave empty for all"
                value={targetTopic}
                onChange={(e) => setTargetTopic(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-lg font-medium"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <ListOrdered size={16} className="text-indigo-500" />
                  Number of Questions
                </label>
                <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full text-sm">
                  {questionCount} Questions
                </span>
              </div>
              <input 
                type="range"
                min="5"
                max="20"
                step="1"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>
          </div>

          <button 
            onClick={startPractice}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 group"
          >
            Generate Exam Paper <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors mx-auto"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
          <BrainCircuit className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Generating Exam-Standard Questions...</h2>
          <p className="text-slate-500 italic max-w-sm">"Ensuring scientific accuracy and curriculum alignment."</p>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-8 animate-fadeIn">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center space-y-6">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={48} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900">Exam Results</h2>
          <div className="space-y-2">
             <div className="text-6xl font-black text-indigo-600">{percentage}%</div>
             <p className="text-slate-500 text-lg">You achieved {quiz.score} marks out of {quiz.questions.length}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
             <button 
                onClick={() => setPhase('setup')}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
             >
               <RefreshCcw size={20} /> New Exam Paper
             </button>
             <button 
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
             >
               <ArrowLeft size={20} /> Dashboard
             </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[quiz.currentIndex];
  const selectedAnswer = quiz.userAnswers[quiz.currentIndex];
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Exam Status Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-end text-sm font-semibold">
          <div className="flex items-center gap-2 text-indigo-700">
             <span className="uppercase tracking-widest text-xs px-2 py-0.5 bg-indigo-100 rounded">Paper 1</span>
             <span>{subject} Practice</span>
          </div>
          <span className="text-slate-500 font-mono">Q{quiz.currentIndex + 1} / {quiz.questions.length}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${((quiz.currentIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg p-10 shadow-md border border-slate-200 animate-slideUp relative">
        <div className="absolute top-0 right-0 p-4">
           <span className="text-[10px] font-mono text-slate-300 uppercase select-none">Cambridge O-Level Equivalent / AceOLevel Internal</span>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex gap-4">
               <span className="font-bold text-slate-900 text-lg shrink-0">{quiz.currentIndex + 1}.</span>
               <h2 className="text-lg font-medium text-slate-900 leading-relaxed">
                 {currentQ.question}
               </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 ml-8">
            {currentQ.options.map((option, idx) => {
              const label = OPTION_LABELS[idx];
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctAnswer;
              
              let variantClasses = "border-slate-200 hover:border-slate-400 hover:bg-slate-50";
              let labelClasses = "bg-slate-100 text-slate-600";
              
              if (isAnswered) {
                if (isCorrect) {
                  variantClasses = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500";
                  labelClasses = "bg-emerald-500 text-white";
                }
                else if (isSelected) {
                  variantClasses = "border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500";
                  labelClasses = "bg-rose-500 text-white";
                }
                else {
                  variantClasses = "border-slate-100 opacity-50";
                  labelClasses = "bg-slate-100 text-slate-400";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 text-left font-normal ${variantClasses}`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${labelClasses}`}>
                    {label}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle size={18} className="text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="space-y-4 pt-8 border-t border-slate-100 animate-fadeIn">
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex gap-4">
                  <div className="bg-white p-2 rounded-xl h-fit shadow-sm">
                    <Lightbulb className="text-indigo-600" size={20} />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-wider mb-1">Examiner's Report & Explanation</h4>
                      <p className="text-indigo-800 text-sm leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                    <div className="p-4 bg-white/80 rounded-xl border border-indigo-200 italic text-sm text-indigo-900 shadow-inner">
                      <strong className="block text-xs uppercase not-italic mb-1 opacity-70">Memory Hook (Analogy):</strong> 
                      {currentQ.analogy}
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={nextQuestion}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-[0.98]"
              >
                {quiz.currentIndex === quiz.questions.length - 1 ? 'End Examination' : 'Proceed to Next Question'} <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
         <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Strictly Confidential - Practice Materials Only</p>
      </div>
    </div>
  );
};

export default PracticeSession;
