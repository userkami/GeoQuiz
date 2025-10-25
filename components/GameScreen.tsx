import React, { useState } from 'react';
import type { Question, GameMode } from '../types.ts';
import CheckIcon from './icons/CheckIcon.tsx';
import XIcon from './icons/XIcon.tsx';

interface GameScreenProps {
  question: Question;
  onAnswer: (selectedOption: string) => void;
  onNext: () => void;
  gameMode: GameMode;
  // Classic / Timed props
  questionNumber?: number;
  totalQuestions?: number;
  timeLeft?: number;
  timerDuration?: number;
  // Party props
  playerName?: string;
}

const GameScreen: React.FC<GameScreenProps> = ({
  question,
  onAnswer,
  onNext,
  gameMode,
  questionNumber = 1,
  totalQuestions = 0,
  timeLeft = 0,
  timerDuration = 1,
  playerName,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const isAnswered = selectedAnswer !== null;

  const handleSelectAnswer = (option: string) => {
    if (isAnswered && gameMode !== 'timed' && gameMode !== 'party') return;
    setSelectedAnswer(option);
    onAnswer(option);
  };
  
  const getButtonClass = (option: string) => {
    if (gameMode === 'timed' || gameMode === 'party' || !isAnswered) {
      return 'bg-slate-800 hover:bg-slate-700';
    }
    if (option === question.correctAnswer.name) {
      return 'bg-green-500 text-white ring-2 ring-green-400';
    }
    if (option === selectedAnswer) {
      return 'bg-red-500 text-white';
    }
    return 'bg-slate-800 opacity-60';
  };
  
  const timerPercentage = (timeLeft / timerDuration) * 100;

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl ring-1 ring-white/10">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-emerald-400">
            {gameMode === 'classic' && `Question ${questionNumber} / ${totalQuestions}`}
            {gameMode === 'timed' && `Score: ${totalQuestions - (questionNumber - (totalQuestions - 1))}`}
            {gameMode === 'party' && `${playerName}'s Turn`}
          </p>
          {(gameMode === 'timed' || gameMode === 'party') && (
            <div className="font-mono text-lg bg-slate-900/50 px-3 py-1 rounded-md">{timeLeft}s</div>
          )}
        </div>
        {gameMode === 'classic' && (
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2">
              <div 
                className="bg-emerald-500 h-2.5 rounded-full" 
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              ></div>
          </div>
        )}
        {(gameMode === 'timed' || gameMode === 'party') && (
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
            <div 
              className={`h-1.5 rounded-full transition-all duration-100 ease-linear ${timerPercentage > 20 ? 'bg-amber-400' : 'bg-red-500'}`}
              style={{ width: `${timerPercentage}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <img
          src={question.flagUrl}
          alt="Country Flag"
          className="w-56 h-auto object-cover rounded-lg shadow-lg border-4 border-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelectAnswer(option)}
            disabled={isAnswered && gameMode === 'classic'}
            className={`w-full p-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center justify-between ${getButtonClass(option)} ${!(isAnswered && gameMode === 'classic') ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {option}
            {isAnswered && gameMode === 'classic' && option === question.correctAnswer.name && <CheckIcon className="w-6 h-6" />}
            {isAnswered && gameMode === 'classic' && option === selectedAnswer && option !== question.correctAnswer.name && <XIcon className="w-6 h-6" />}
          </button>
        ))}
      </div>

      {isAnswered && gameMode === 'classic' && (
        <div className="mt-6 text-center animate-fade-in">
          <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-slate-100 mb-2">Fun Fact</h3>
              <p className="text-slate-300">{question.correctAnswer.fact}</p>
          </div>
          <button
            onClick={onNext}
            className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {questionNumber === totalQuestions ? 'Show Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GameScreen;