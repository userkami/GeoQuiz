import React from 'react';

interface TurnStartScreenProps {
  playerName: string;
  onContinue: () => void;
}

const TurnStartScreen: React.FC<TurnStartScreenProps> = ({ playerName, onContinue }) => {
  return (
    <div className="text-center bg-slate-900/60 backdrop-blur-sm rounded-2xl p-12 md:p-16 shadow-2xl ring-1 ring-white/10 animate-fade-in">
      <p className="text-2xl text-slate-300 mb-2">Get Ready</p>
      <h1 className="text-5xl md:text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
        {playerName}
      </h1>
      <p className="text-2xl text-slate-300 mb-10">It's your turn!</p>
      
      <button
        onClick={onContinue}
        className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 px-12 rounded-full text-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-emerald-500/30"
      >
        Show Question
      </button>
    </div>
  );
};

export default TurnStartScreen;
