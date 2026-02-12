
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Subject, Question, QuizState } from '../types';
import { generateQuestions } from '../geminiService';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  RefreshCcw, 
  Loader2,
  BrainCircuit
} from 'lucide-react';

const PracticeSession: React.FC = () => {
  const { subject } = useParams<{ subject: Subject }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    showResult: false,
    userAnswers: []
  });

  const loadQuestions = useCallback(async () => {
    if (!subject) return;
    setLoading(true);
    try {
      const qs = await generateQuestions(subject as Subject, 5);
      setQuiz({
        questions: qs,
        currentIndex: 0,
        score: 0,
        showResult: false,
        userAnswers: new Array(qs.length).fill(null)
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

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
      setQuiz(prev => ({ ...prev, showResult: true }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
          <BrainCircuit className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Preparing Your Session...</h2>
          <p className="text-slate-500 italic">"Like an athlete warming up, the AI is curating the best questions for you."</p>
        </div>
      </div>
    );
  }

  if (quiz.showResult) {
    const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-8 animate-fadeIn">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center space-y-6">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrophyIcon size={48} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900">Session Complete!</h2>
          <div className="space-y-2">
             <div className="text-6xl font-black text-indigo-600">{percentage}%</div>
             <p className="text-slate-500 text-lg">You scored {quiz.score} out of {quiz.questions.length}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
             <button 
                onClick={loadQuestions}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
             >
               <RefreshCcw size={20} /> Try New Set
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
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-end text-sm font-medium">
          <span className="text-indigo-600">{subject} Practice</span>
          <span className="text-slate-500">Question {quiz.currentIndex + 1} of {quiz.questions.length}</span>
        </div>
        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${((quiz.currentIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 animate-slideUp">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
              {currentQ.topic}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {currentQ.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctAnswer;
              
              let variantClasses = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50";
              if (isAnswered) {
                if (isCorrect) variantClasses = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500 ring-opacity-50";
                else if (isSelected) variantClasses = "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500 ring-opacity-50";
                else variantClasses = "border-slate-100 opacity-60";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200 font-medium ${variantClasses}`}
                >
                  <span className="flex-1">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0 ml-2" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="text-rose-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="space-y-4 pt-4 border-t border-slate-100 animate-fadeIn">
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex gap-3">
                  <Lightbulb className="text-amber-500 shrink-0 mt-1" />
                  <div className="space-y-3">
                    <h4 className="font-bold text-amber-900">Explanation & Analogy</h4>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      {currentQ.explanation}
                    </p>
                    <div className="p-3 bg-white/60 rounded-xl border border-amber-200 italic text-sm text-amber-900">
                      <strong>Analogy:</strong> {currentQ.analogy}
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={nextQuestion}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
              >
                {quiz.currentIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrophyIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 22V18" /><path d="M14 22V18" /><path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
  </svg>
);

export default PracticeSession;
