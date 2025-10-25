import React, { useState } from 'react';
import GlobeIcon from './icons/GlobeIcon.tsx';
import UsersIcon from './icons/UsersIcon.tsx';
import type { GameMode } from '../types.ts';

interface WelcomeScreenProps {
  onStartClassicTimed: (mode: GameMode, duration: number) => void;
  onStartParty: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartClassicTimed, onStartParty }) => {
  const [mode, setMode] = useState<GameMode>('classic');
  const [duration, setDuration] = useState(60);

  const durationOptions = [30, 60, 90];

  const handleStart = () => {
    if (mode === 'classic' || mode === 'timed') {
      onStartClassicTimed(mode, duration);
    }
  };

  return (
    <div className="text-center bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl ring-1 ring-white/10">
      <div className="flex justify-center items-center mb-6">
          <GlobeIcon className="w-16 h-16 text-emerald-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
        GeoQuiz: Guess the Flag
      </h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
        Test your knowledge of world flags. Play solo or challenge your friends!
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Choose a Mode</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setMode('classic')}
            className={`py-3 px-4 rounded-xl font-semibold transition-all ${mode === 'classic' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white ring-2 ring-emerald-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
          >
            Classic
          </button>
          <button
            onClick={() => setMode('timed')}
            className={`py-3 px-4 rounded-xl font-semibold transition-all ${mode === 'timed' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white ring-2 ring-emerald-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
          >
            Timed
          </button>
          <button
            onClick={onStartParty}
            className="py-3 px-4 rounded-xl font-semibold transition-all bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-2"
          >
            <UsersIcon className="w-5 h-5" />
            Party Mode
          </button>
        </div>
      </div>

      {mode === 'timed' && (
        <div className="mb-8 p-6 bg-slate-900/50 rounded-lg animate-fade-in">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Game duration</h3>
          <div className="flex justify-center gap-4">
            {durationOptions.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`w-16 h-16 flex items-center justify-center rounded-full font-semibold transition-colors ${duration === d ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white ring-2 ring-emerald-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
      )}

      {(mode === 'classic' || mode === 'timed') && (
        <button
          onClick={handleStart}
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-emerald-500/30"
        >
          Start {mode === 'classic' ? 'Classic' : 'Timed'} Game
        </button>
      )}
    </div>
  );
};

export default WelcomeScreen;