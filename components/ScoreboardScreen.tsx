import React from 'react';
import type { Player } from '../types';
import TrophyIcon from './icons/TrophyIcon';

interface ScoreboardScreenProps {
  players: Player[];
  round: number;
  onNextRound: () => void;
}

const ScoreboardScreen: React.FC<ScoreboardScreenProps> = ({ players, round, onNextRound }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-lg mx-auto text-center bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Round {round} Complete!</h1>
      <p className="text-xl text-slate-400 mb-8">Current Standings</p>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-4 rounded-lg text-left ${index === 0 ? 'bg-emerald-500/20 border-2 border-emerald-400' : 'bg-slate-800'}`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-bold w-8 ${index === 0 ? 'text-emerald-300' : 'text-slate-400'}`}>{index + 1}</span>
              <span className="text-xl font-semibold text-slate-100">{player.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {index === 0 && <TrophyIcon className="w-6 h-6 text-amber-400" />}
              <span className="text-2xl font-bold text-white">{player.score}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={onNextRound}
        className="mt-10 w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-emerald-500/30"
      >
        Start Next Round
      </button>
    </div>
  );
};

export default ScoreboardScreen;
