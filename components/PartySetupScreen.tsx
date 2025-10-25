import React, { useState, useRef, FormEvent } from 'react';
import XIcon from './icons/XIcon';
import UsersIcon from './icons/UsersIcon';

interface PartySetupScreenProps {
  onStart: (playerNames: string[], duration: number) => void;
  onBack: () => void;
}

const PartySetupScreen: React.FC<PartySetupScreenProps> = ({ onStart, onBack }) => {
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2']);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [duration, setDuration] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const durationOptions = [30, 60, 90];

  const handleAddPlayer = (e: FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim() && players.length < 4 && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };
  
  const handleRemovePlayer = (nameToRemove: string) => {
    setPlayers(players.filter(p => p !== nameToRemove));
  };
  
  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 shadow-2xl ring-1 ring-white/10">
      <div className="flex items-center justify-center mb-6 text-center">
        <UsersIcon className="w-12 h-12 text-emerald-400 mr-4" />
        <h1 className="text-3xl font-extrabold text-slate-100">Party Setup</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-200 mb-3">Players ({players.length}/4)</h2>
        <div className="space-y-2 mb-3">
          {players.map(player => (
            <div key={player} className="flex justify-between items-center bg-slate-800/70 p-3 rounded-lg">
              <span className="font-semibold text-slate-100">{player}</span>
              {players.length > 2 && (
                <button onClick={() => handleRemovePlayer(player)} className="text-slate-400 hover:text-red-400">
                  <XIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {players.length < 4 && (
          <form onSubmit={handleAddPlayer} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newPlayerName}
              onChange={e => setNewPlayerName(e.target.value)}
              placeholder="Enter player name..."
              className="flex-grow bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button type="submit" className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50" disabled={!newPlayerName.trim() || players.includes(newPlayerName.trim())}>
              Add
            </button>
          </form>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-200 mb-3">Time Per Player</h2>
        <div className="flex justify-center gap-4">
          {durationOptions.map(d => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`w-20 h-14 flex items-center justify-center rounded-lg font-semibold text-lg transition-colors ${duration === d ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white ring-2 ring-emerald-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => onStart(players, duration)}
          disabled={players.length < 2}
          className="w-full sm:w-auto flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:from-slate-600 disabled:to-slate-700"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default PartySetupScreen;