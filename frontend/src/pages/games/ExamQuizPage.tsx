import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw, Trophy, CheckCircle, XCircle } from 'lucide-react';
import GlassPanel from '../../components/GlassPanel';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    question: "What is Doraemon's favorite food?",
    options: ['Sushi', 'Dorayaki', 'Ramen', 'Tempura'],
    correct: 1,
  },
  {
    question: "Where does Doraemon keep all his gadgets?",
    options: ['His backpack', 'A magic hat', 'His 4D pocket', 'A secret drawer'],
    correct: 2,
  },
  {
    question: "What color is Doraemon?",
    options: ['Green', 'Yellow', 'Blue', 'Red'],
    correct: 2,
  },
  {
    question: "What is the name of Nobita's crush?",
    options: ['Shizuka', 'Jaiko', 'Dekisugi', 'Suneo'],
    correct: 0,
  },
  {
    question: "Which gadget does Doraemon use to fly?",
    options: ['Take-copter', 'Anywhere Door', 'Small Light', 'Translation Konjac'],
    correct: 0,
  },
  {
    question: "What is the 'Anywhere Door' used for?",
    options: ['Time travel', 'Teleportation', 'Making things small', 'Flying'],
    correct: 1,
  },
  {
    question: "What year does Doraemon come from?",
    options: ['2112', '2050', '3000', '2200'],
    correct: 0,
  },
  {
    question: "Who is Nobita's bully?",
    options: ['Suneo', 'Gian (Takeshi)', 'Dekisugi', 'Doraemon'],
    correct: 1,
  },
  {
    question: "What is Nobita's typical exam score?",
    options: ['50', '30', '0', '10'],
    correct: 2,
  },
  {
    question: "What does the 'Small Light' gadget do?",
    options: ['Makes things glow', 'Shrinks objects', 'Creates light', 'Teleports'],
    correct: 1,
  },
];

const NOBITA_SCORE = 0;

export default function ExamQuizPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(QUESTIONS.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (optionIdx: number) => {
    if (selected !== null) return;
    setSelected(optionIdx);
    const isCorrect = optionIdx === QUESTIONS[currentQ].correct;
    const newAnswers = [...answers];
    newAnswers[currentQ] = isCorrect;
    setAnswers(newAnswers);
    if (isCorrect) setScore((s) => s + 10);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setFinished(false);
    setShowResult(false);
  };

  const q = QUESTIONS[currentQ];
  const beatNobita = score > NOBITA_SCORE;
  const percentage = Math.round((score / (QUESTIONS.length * 10)) * 100);

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: '/games' })}
            className="w-10 h-10 rounded-full glass border border-dora-yellow/30 flex items-center justify-center text-foreground/60 hover:text-dora-yellow transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-dora-yellow">Nobita's Exam Quiz</h1>
            <p className="text-foreground/50 text-sm font-space">Beat Nobita's score of 0! 📝</p>
          </div>
        </div>

        {/* Progress */}
        {!finished && (
          <div className="mb-6">
            <div className="flex justify-between text-xs font-space text-foreground/50 mb-2">
              <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-dora-yellow to-dora-cyan rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + (showResult ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question Card */}
        {!finished && (
          <GlassPanel glowColor="yellow" className="p-6 mb-4">
            <div className="text-4xl text-center mb-4">📝</div>
            <h2 className="font-nunito text-lg font-bold text-foreground mb-6 text-center leading-relaxed">
              {q.question}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {q.options.map((option, idx) => {
                let btnClass = 'glass border border-white/20 text-foreground/80 hover:border-dora-yellow/50 hover:text-dora-yellow';
                if (showResult) {
                  if (idx === q.correct) {
                    btnClass = 'glass border-2 border-green-400/70 text-green-400 bg-green-400/10';
                  } else if (idx === selected && idx !== q.correct) {
                    btnClass = 'glass border-2 border-dora-red/70 text-dora-red bg-dora-red/10';
                  } else {
                    btnClass = 'glass border border-white/10 text-foreground/40';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showResult}
                    className={`w-full p-3 rounded-xl text-left font-space text-sm transition-all duration-200 flex items-center gap-3 ${btnClass}`}
                  >
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                    {showResult && idx === q.correct && <CheckCircle size={16} className="ml-auto text-green-400" />}
                    {showResult && idx === selected && idx !== q.correct && <XCircle size={16} className="ml-auto text-dora-red" />}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-4 text-center">
                <p className={`font-space text-sm mb-3 ${selected === q.correct ? 'text-green-400' : 'text-dora-red'}`}>
                  {selected === q.correct ? '✅ Correct! Doraemon is proud!' : '❌ Wrong! Even Nobita knew this one!'}
                </p>
                <button onClick={handleNext} className="dora-btn dora-btn-yellow">
                  {currentQ < QUESTIONS.length - 1 ? 'Next Question →' : 'See Results!'}
                </button>
              </div>
            )}
          </GlassPanel>
        )}

        {/* Answer tracker */}
        {!finished && (
          <div className="flex gap-2 justify-center flex-wrap">
            {answers.map((ans, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                  i === currentQ
                    ? 'border-dora-yellow text-dora-yellow bg-dora-yellow/20'
                    : ans === true
                    ? 'border-green-400 text-green-400 bg-green-400/10'
                    : ans === false
                    ? 'border-dora-red text-dora-red bg-dora-red/10'
                    : 'border-white/20 text-foreground/30'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Results Modal */}
        {finished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <GlassPanel glowColor="yellow" className="p-8 text-center max-w-sm mx-4">
              <div className="text-6xl mb-3">{beatNobita ? '🏆' : '😅'}</div>
              <Trophy className="text-dora-yellow mx-auto mb-3" size={32} />
              <h2 className="font-orbitron text-2xl font-bold text-dora-yellow mb-2">
                {beatNobita ? 'You Beat Nobita!' : "Nobita's Level!"}
              </h2>
              <p className="text-foreground/70 font-nunito mb-1">
                Your Score: <span className="text-dora-cyan font-bold text-2xl">{score}</span>
              </p>
              <p className="text-foreground/50 font-space text-sm mb-1">
                {percentage}% correct
              </p>
              <p className="text-foreground/40 font-space text-xs mb-6">
                Nobita's score: {NOBITA_SCORE} 😂
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="dora-btn dora-btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  Try Again
                </button>
                <button
                  onClick={() => navigate({ to: '/games' })}
                  className="dora-btn dora-btn-yellow flex-1"
                >
                  Games Hub
                </button>
              </div>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
}
