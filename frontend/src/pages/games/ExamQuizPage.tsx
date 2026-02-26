import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Trophy, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import GlassPanel from '../../components/GlassPanel';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    question: "What is Doraemon's favorite food?",
    options: ["Sushi 🍣", "Dorayaki 🍩", "Ramen 🍜", "Takoyaki 🐙"],
    correct: 1,
    explanation: "Doraemon LOVES dorayaki! He'd do anything for one! 🍩",
  },
  {
    question: "What color is Doraemon?",
    options: ["Yellow 💛", "Green 💚", "Blue 🔵", "Red ❤️"],
    correct: 2,
    explanation: "Doraemon is blue! He turned blue after a robot mouse ate his ears and he cried so much his yellow paint washed off! 😢",
  },
  {
    question: "Where does Doraemon keep all his gadgets?",
    options: ["In a backpack 🎒", "In his hat 🎩", "In his 4D pocket 🔵", "Under his bed 🛏️"],
    correct: 2,
    explanation: "Doraemon's 4D pocket on his belly holds thousands of amazing gadgets! 🎁",
  },
  {
    question: "What gadget does Doraemon use to fly?",
    options: ["Magic Carpet 🪄", "Take-copter 🚁", "Jet Boots 👟", "Flying Saucer 🛸"],
    correct: 1,
    explanation: "The Take-copter (Bamboo Copter) attaches to your head and lets you fly! 🚁",
  },
  {
    question: "What is Nobita's worst subject in school?",
    options: ["Art 🎨", "Music 🎵", "Math & All Subjects 📚", "PE 🏃"],
    correct: 2,
    explanation: "Poor Nobita struggles with everything! He often scores 0 on tests! 😅",
  },
  {
    question: "What does the 'Anywhere Door' do?",
    options: [
      "Makes you invisible 👻",
      "Teleports you anywhere 🚪",
      "Shrinks you tiny 🔬",
      "Lets you time travel ⏰",
    ],
    correct: 1,
    explanation: "The Anywhere Door teleports you to any location you think of! 🚪✨",
  },
  {
    question: "Who is Nobita's childhood friend who he has a crush on?",
    options: ["Jaiko 👧", "Dekisugi 🤓", "Shizuka 🌸", "Suneo's sister 👩"],
    correct: 2,
    explanation: "Shizuka Minamoto is Nobita's kind and smart friend he has a crush on! 🌸",
  },
  {
    question: "What century does Doraemon come from?",
    options: ["20th Century", "21st Century", "22nd Century 🚀", "23rd Century"],
    correct: 2,
    explanation: "Doraemon was sent from the 22nd century by Nobita's future grandson! 🚀",
  },
  {
    question: "What is Gian's real name?",
    options: ["Takeshi Goda 💪", "Hiroshi Tanaka", "Kenji Yamada", "Taro Suzuki"],
    correct: 0,
    explanation: "Gian's real name is Takeshi Goda! He's big, loud, and loves (terrible) singing! 🎵",
  },
  {
    question: "What does the 'Small Light' gadget do?",
    options: [
      "Makes things glow 💡",
      "Shrinks objects and people 🔬",
      "Creates a flashlight 🔦",
      "Turns things invisible 👻",
    ],
    correct: 1,
    explanation: "The Small Light shrinks anything it shines on! The Big Light makes things giant! 🔬",
  },
  {
    question: "What is Suneo's personality known for?",
    options: ["Being very kind 😇", "Being very brave 💪", "Bragging and showing off 🤑", "Being very smart 🤓"],
    correct: 2,
    explanation: "Suneo is always bragging about his rich family and new toys! 🤑",
  },
  {
    question: "What does Nobita usually do instead of studying?",
    options: ["Play sports ⚽", "Sleep and watch TV 😴📺", "Read books 📖", "Cook food 🍳"],
    correct: 1,
    explanation: "Nobita is famous for sleeping and watching TV instead of doing homework! 😴",
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ExamQuizPage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const startGame = () => {
    const shuffled = shuffle(QUESTIONS).slice(0, 10);
    setQuestions(shuffled);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswers([]);
    setShowExplanation(false);
    setGameState('playing');
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === questions[currentQ].correct;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, isCorrect]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setGameState('over');
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const getScoreMessage = () => {
    if (score === 10) return { msg: "PERFECT! Even Dekisugi is jealous! 🏆", emoji: "🌟" };
    if (score >= 8) return { msg: "Excellent! Doraemon is so proud! 🔵", emoji: "🎉" };
    if (score >= 6) return { msg: "Good job! Better than Nobita! 😄", emoji: "👍" };
    if (score >= 4) return { msg: "Not bad! Keep watching Doraemon! 📺", emoji: "😊" };
    if (score >= 2) return { msg: "Hmm... Nobita scored higher! 😅", emoji: "😅" };
    return { msg: "Oh no! Even Nobita got more right! 😂", emoji: "😂" };
  };

  const q = questions[currentQ];

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: '/games' })}
            className="w-10 h-10 rounded-xl glass border border-dora-yellow/30 flex items-center justify-center text-foreground/60 hover:text-dora-yellow transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-dora-yellow">Nobita's Exam Quiz</h1>
            <p className="text-foreground/50 font-space text-sm">Can you beat Nobita's score? 📝</p>
          </div>
        </div>

        {/* Idle Screen */}
        {gameState === 'idle' && (
          <GlassPanel glowColor="yellow" className="p-8 text-center">
            <div className="text-6xl mb-4 animate-float">📝</div>
            <h2 className="font-orbitron text-2xl font-bold text-dora-yellow mb-3">Doraemon Trivia!</h2>
            <p className="text-foreground/60 font-nunito text-base mb-2">
              10 questions about Doraemon, gadgets, and characters!
            </p>
            <p className="text-foreground/40 font-space text-sm mb-6">
              Nobita usually scores 0... can you do better? 😄
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              {[
                { label: 'Questions', value: '10', color: 'text-dora-yellow' },
                { label: 'Nobita\'s Score', value: '0/10', color: 'text-dora-red' },
                { label: 'Your Goal', value: '10/10', color: 'text-dora-cyan' },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass rounded-xl p-3 border border-white/10">
                  <div className={`font-orbitron font-bold text-xl ${color}`}>{value}</div>
                  <div className="text-foreground/40 text-xs font-space mt-1">{label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-2xl bg-dora-yellow/30 border border-dora-yellow/60 text-dora-yellow font-orbitron font-bold text-lg hover:bg-dora-yellow/50 transition-all duration-300 glow-yellow"
            >
              Start Exam! 📝
            </button>
          </GlassPanel>
        )}

        {/* Playing Screen */}
        {gameState === 'playing' && q && (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-foreground/50 font-space text-sm">
                Question {currentQ + 1} / {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-dora-yellow" />
                <span className="text-dora-yellow font-orbitron font-bold">{score}</span>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-dora-yellow rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <GlassPanel glowColor="yellow" className="p-6 mb-4">
              <div className="flex items-start gap-3 mb-6">
                <BookOpen size={20} className="text-dora-yellow flex-shrink-0 mt-0.5" />
                <p className="font-nunito text-lg text-foreground/90 leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {q.options.map((option, idx) => {
                  let btnClass = 'glass border border-white/20 text-foreground/70 hover:border-dora-yellow/50 hover:text-foreground';
                  if (selected !== null) {
                    if (idx === q.correct) {
                      btnClass = 'bg-green-500/20 border border-green-500/60 text-green-400';
                    } else if (idx === selected && idx !== q.correct) {
                      btnClass = 'bg-dora-red/20 border border-dora-red/60 text-dora-red';
                    } else {
                      btnClass = 'glass border border-white/10 text-foreground/30';
                    }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selected !== null}
                      className={`w-full text-left px-4 py-3 rounded-xl font-space text-sm transition-all duration-200 flex items-center gap-3 ${btnClass}`}
                    >
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                      {selected !== null && idx === q.correct && (
                        <CheckCircle size={16} className="ml-auto text-green-400 flex-shrink-0" />
                      )}
                      {selected !== null && idx === selected && idx !== q.correct && (
                        <XCircle size={16} className="ml-auto text-dora-red flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="mt-4 p-3 rounded-xl bg-dora-blue/10 border border-dora-blue/30">
                  <p className="text-foreground/70 font-nunito text-sm leading-relaxed">
                    💡 {q.explanation}
                  </p>
                </div>
              )}
            </GlassPanel>

            {selected !== null && (
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-2xl bg-dora-yellow/30 border border-dora-yellow/60 text-dora-yellow font-orbitron font-bold hover:bg-dora-yellow/50 transition-all duration-300"
                >
                  {currentQ + 1 >= questions.length ? 'See Results! 🏆' : 'Next Question →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'over' && (
          <GlassPanel glowColor="yellow" className="p-8 text-center">
            {(() => {
              const { msg, emoji } = getScoreMessage();
              return (
                <>
                  <div className="text-6xl mb-4">{emoji}</div>
                  <h2 className="font-orbitron text-2xl font-bold text-dora-yellow mb-2">Exam Complete!</h2>
                  <p className="text-foreground/60 font-nunito mb-4">{msg}</p>

                  <div className="glass rounded-2xl p-6 mb-6 border border-dora-yellow/30">
                    <div className="font-orbitron text-5xl font-bold text-dora-yellow mb-1">
                      {score}<span className="text-2xl text-foreground/40">/10</span>
                    </div>
                    <p className="text-foreground/50 font-space text-sm">Your Score</p>
                  </div>

                  {/* Answer summary */}
                  <div className="flex justify-center gap-2 mb-6 flex-wrap">
                    {answers.map((correct, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          correct ? 'bg-green-500/30 border border-green-500/60 text-green-400' : 'bg-dora-red/30 border border-dora-red/60 text-dora-red'
                        }`}
                      >
                        {correct ? '✓' : '✗'}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={startGame}
                      className="px-6 py-2.5 rounded-2xl bg-dora-yellow/30 border border-dora-yellow/60 text-dora-yellow font-orbitron font-bold hover:bg-dora-yellow/50 transition-all duration-300"
                    >
                      Try Again! 📝
                    </button>
                    <button
                      onClick={() => navigate({ to: '/games' })}
                      className="px-6 py-2.5 rounded-2xl glass border border-white/20 text-foreground/60 font-space hover:text-foreground transition-all duration-300"
                    >
                      Back
                    </button>
                  </div>
                </>
              );
            })()}
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
