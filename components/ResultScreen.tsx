import React from 'react';
import type { AnswerRecord, GameMode, Player } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import TrophyIcon from './icons/TrophyIcon';

interface ResultScreenProps {
  onPlayAgain: () => void;
  gameMode: GameMode;
  // Classic / Timed
  score?: number;
  totalQuestions?: number;
  answerRecords?: AnswerRecord[];
  // Party
  players?: Player[];
}

const ResultScreen: React.FC<ResultScreenProps> = ({ 
  onPlayAgain, 
  gameMode, 
  score = 0, 
  totalQuestions = 0, 
  answerRecords = [], 
  players = [] 
}) => {
  const renderClassicResults = () => {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const getResultMessage = () => {
      if (percentage === 100) return "Perfect Score! You're a true vexillologist!";
      if (percentage >= 70) return "Excellent! You really know your flags.";
      if (percentage >= 40) return "Good effort! A little more practice and you'll be an expert.";
      return "Keep trying! Every quiz is a learning opportunity.";
    };
    return (
      <div className="text-center bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl ring-1 ring-white/10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-100">Quiz Complete!</h1>
        <p className="text-xl text-slate-400 mb-6">Your final score is</p>
        
        <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
              <circle
                  className="text-emerald-400"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={(2 * Math.PI * 45) * (1 - (percentage || 0) / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
              />
          </svg>
          <span className="absolute text-5xl font-bold text-white">{percentage || 0}%</span>
        </div>
        
        <p className="text-2xl font-semibold mb-4 text-slate-100">{score} / {totalQuestions}</p>
        <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">{getResultMessage()}</p>
        
        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-emerald-500/30"
        >
          Play Again
        </button>
      </div>
    );
  };

  const renderTimedResults = () => (
    <div className="text-center bg-slate-900/60 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-2xl ring-1 ring-white/10 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-slate-100">Time's Up!</h1>
      <p className="text-lg text-slate-400 mb-2">You answered {answerRecords.length} questions.</p>
      <p className="text-xl font-semibold text-slate-100 mb-6">Correct answers: {score}</p>

      
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {answerRecords.map((record, index) => (
          <div key={index} className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
            <img src={record.question.flagUrl} alt={`${record.question.correctAnswer.name} flag`} className="w-16 h-10 object-cover rounded shadow-md" />
            <div className="flex-1 text-left">
              <p className="font-bold text-slate-100">{record.question.correctAnswer.name}</p>
              <p className={`text-sm ${record.isCorrect ? 'text-slate-400' : 'text-red-400'}`}>
                Your answer: {record.userAnswer ?? <span className="italic opacity-75">Time ran out</span>}
              </p>
            </div>
            {record.isCorrect 
              ? <CheckIcon className="w-8 h-8 flex-shrink-0 text-green-500" /> 
              : <XIcon className="w-8 h-8 flex-shrink-0 text-red-500" />
            }
          </div>
        ))}
      </div>
      
      <button
        onClick={onPlayAgain}
        className="mt-6 w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-emerald-500/30"
      >
        Play Again
      </button>
    </div>
  );

  const renderPartyResults = () => {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
       <div className="text-center bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl ring-1 ring-white/10">
        <div className="flex justify-center items-center mb-4">
          <TrophyIcon className="w-16 h-16 text-amber-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-slate-100">
          {winner.name} Wins!
        </h1>
        <p className="text-xl text-slate-400 mb-8">Final Score: {winner.score} points</p>
        
        <div className="space-y-3 max-w-sm mx-auto">
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className={`flex items-center justify-between p-4 rounded-lg ${index === 0 ? 'bg-amber-500/20 border-2 border-amber-400' : 'bg-slate-800'}`}>
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold w-8 text-left ${index === 0 ? 'text-amber-300' : 'text-slate-400'}`}>{index + 1}</span>
                <span className="text-xl font-semibold text-slate-100">{player.name}</span>
              </div>
              <span className="text-2xl font-bold text-white">{player.score}</span>
            </div>
          ))}
        </div>
        
        <button
          onClick={onPlayAgain}
          className="mt-10 w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-emerald-500/30"
        >
          Play Again
        </button>
      </div>
    )
  };
  
  switch (gameMode) {
    case 'classic': return renderClassicResults();
    case 'timed': return renderTimedResults();
    case 'party': return renderPartyResults();
    default: return null;
  }
};

export default ResultScreen;