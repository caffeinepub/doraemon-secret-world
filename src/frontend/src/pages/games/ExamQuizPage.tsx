import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import GlassPanel from "../../components/GlassPanel";

const questions = [
  {
    question: "What is Doraemon's favorite food?",
    options: ["Sushi", "Dorayaki", "Ramen", "Tempura"],
    correct: 1,
  },
  {
    question: "Where does Doraemon keep his gadgets?",
    options: [
      "In a backpack",
      "In his hat",
      "In his 4D pocket",
      "Under his collar",
    ],
    correct: 2,
  },
  {
    question: "What century did Doraemon come from?",
    options: ["21st century", "22nd century", "23rd century", "25th century"],
    correct: 1,
  },
  {
    question: "What is the name of Nobita's crush?",
    options: ["Jaiko", "Shizuka", "Tamako", "Dekisugi"],
    correct: 1,
  },
  {
    question: "What color is Doraemon?",
    options: ["Green", "Yellow", "Blue", "Red"],
    correct: 2,
  },
  {
    question: "What is Nobita's typical test score?",
    options: ["100", "50", "0", "25"],
    correct: 2,
  },
  {
    question: "What gadget allows travel to any location?",
    options: ["Time Machine", "Anywhere Door", "Small Light", "Take-copter"],
    correct: 1,
  },
  {
    question: "What is the flying gadget on Doraemon's head called?",
    options: ["Fly Hat", "Take-copter", "Sky Rotor", "Bamboo Copter"],
    correct: 1,
  },
  {
    question: "Who is the bully in Nobita's group?",
    options: ["Suneo", "Gian (Takeshi)", "Dekisugi", "Sensei"],
    correct: 1,
  },
  {
    question: "What is Doraemon afraid of?",
    options: ["Water", "Dogs", "Mice", "Thunder"],
    correct: 2,
  },
];

export default function ExamQuizPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [_answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    const correct = optionIndex === questions[currentQ].correct;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, correct]);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
    setAnswers([]);
  };

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <GlassPanel glow="yellow" className="p-8 text-center">
          <Trophy className="w-16 h-16 text-doraemon-yellow mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white mb-2">
            Quiz Complete!
          </h2>
          <p className="text-white/60 mb-6">
            {score >= 8
              ? "Amazing! You know Doraemon better than Nobita! 🎉"
              : score >= 5
                ? "Not bad! Doraemon would be proud! 😊"
                : "You scored like Nobita on an exam! 😅"}
          </p>
          <div className="text-6xl font-bold text-doraemon-yellow mb-2">
            {score}/{questions.length}
          </div>
          <p className="text-white/50 mb-6">{percentage}% correct</p>
          <p className="text-white/40 text-sm mb-8">
            Nobita's legendary score: 0/{questions.length} 😂
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleRestart}
              className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/games" })}
              className="border-white/20 text-white hover:bg-white/10 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
          </div>
        </GlassPanel>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/games" })}
          className="text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Games
        </Button>
        <div className="flex-1 bg-white/10 rounded-full h-2">
          <div
            className="bg-doraemon-yellow h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentQ / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-white/60 text-sm">
          {currentQ + 1}/{questions.length}
        </span>
      </div>

      <GlassPanel glow="yellow" className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-doraemon-yellow text-sm font-medium">
            Question {currentQ + 1}
          </span>
          <span className="text-white/30 text-sm">• Score: {score}</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          {q.question}
        </h2>

        <div className="space-y-3">
          {q.options.map((option, i) => {
            let btnClass =
              "w-full text-left p-4 rounded-xl border transition-all duration-200 ";
            if (!answered) {
              btnClass +=
                "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 cursor-pointer";
            } else if (i === q.correct) {
              btnClass += "border-green-400 bg-green-400/20 text-green-300";
            } else if (i === selected && i !== q.correct) {
              btnClass += "border-red-400 bg-red-400/20 text-red-300";
            } else {
              btnClass += "border-white/10 bg-white/5 text-white/40";
            }

            return (
              <button
                type="button"
                key={option}
                className={btnClass}
                onClick={() => handleAnswer(i)}
                disabled={answered}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-sm font-bold shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                  {answered && i === q.correct && (
                    <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                  )}
                  {answered && i === selected && i !== q.correct && (
                    <XCircle className="w-4 h-4 ml-auto text-red-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleNext}
              className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white"
            >
              {currentQ + 1 >= questions.length
                ? "See Results"
                : "Next Question →"}
            </Button>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
