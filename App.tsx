import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { GameState, Question, GameMode, AnswerRecord, Player } from './types.ts';
import { COUNTRIES, TOTAL_QUESTIONS } from './constants.ts';
import { shuffleArray } from './utils/helpers.ts';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import GameScreen from './components/GameScreen.tsx';
import ResultScreen from './components/ResultScreen.tsx';
import PartySetupScreen from './components/PartySetupScreen.tsx';
import TurnStartScreen from './components/TurnStartScreen.tsx';

function App() {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [initialTimerDuration, setInitialTimerDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);

  // Party Mode State
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const gameTimerRef = useRef<number | null>(null);
  // Ref to hold current state for the timer callback to avoid stale closures
  const stateRef = useRef({ gameMode, currentPlayerIndex, players });
  useEffect(() => {
    stateRef.current = { gameMode, currentPlayerIndex, players };
  }, [gameMode, currentPlayerIndex, players]);


  const stopGameTimer = useCallback(() => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
  }, []);
  
  const handleTurnEnd = useCallback(() => {
      stopGameTimer();
      const { gameMode, currentPlayerIndex, players } = stateRef.current;
      if (gameMode === 'party') {
          const nextPlayerIndex = currentPlayerIndex + 1;
          if (nextPlayerIndex < players.length) {
              setCurrentPlayerIndex(nextPlayerIndex);
              setGameState('turn-start');
          } else {
              setGameState('results');
          }
      } else { // Timed mode ends
          setGameState('results');
      }
  }, [stopGameTimer]);

  const tick = useCallback(() => {
    setTimeLeft(prev => {
        if (prev <= 1) {
            handleTurnEnd();
            return 0;
        }
        return prev - 1;
    });
  }, [handleTurnEnd]);

  const startTimer = useCallback(() => {
      stopGameTimer();
      gameTimerRef.current = window.setInterval(tick, 1000);
  }, [stopGameTimer, tick]);

  const generateQuestions = useCallback((count: number) => {
    const shuffledCountries = shuffleArray(COUNTRIES);
    const gameCountries = shuffledCountries.slice(0, count);

    const newQuestions = gameCountries.map((correctCountry) => {
      const distractors = shuffleArray(COUNTRIES.filter(c => c.code !== correctCountry.code)).slice(0, 3);
      const options = shuffleArray([...distractors.map(d => d.name), correctCountry.name]);

      return {
        correctAnswer: correctCountry,
        options,
        flagUrl: `https://flagcdn.com/w320/${correctCountry.code}.png`
      };
    });

    setQuestions(newQuestions);
  }, []);
  
  const resetGame = useCallback(() => {
    stopGameTimer();
    setGameState('welcome');
    setPlayers([]);
    setCurrentPlayerIndex(0);
  }, [stopGameTimer]);

  // FIX: GameMode is a string literal union type, not a namespace.
  const startClassicOrTimedGame = useCallback((mode: 'classic' | 'timed', duration: number) => {
    generateQuestions(mode === 'classic' ? TOTAL_QUESTIONS : COUNTRIES.length);
    setGameMode(mode);
    setInitialTimerDuration(duration);
    setTimeLeft(duration);
    setCurrentQuestionIndex(0);
    setAnswerRecords([]);
    setGameState('playing');
    stopGameTimer();

    if (mode === 'timed') {
      startTimer();
    }
  }, [generateQuestions, stopGameTimer, startTimer]);

  const startPartyGame = useCallback((playerNames: string[], duration: number) => {
    generateQuestions(COUNTRIES.length); // Ensure enough questions for everyone
    setGameMode('party');
    setInitialTimerDuration(duration);
    setPlayers(playerNames.map((name, index) => ({ id: index, name, score: 0 })));
    setCurrentPlayerIndex(0);
    setCurrentQuestionIndex(0);
    setGameState('turn-start');
  }, [generateQuestions]);

  const handleNext = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= questions.length) {
      // Ran out of questions, end turn early
      handleTurnEnd();
      return;
    }

    if (gameMode === 'classic' && nextIndex >= TOTAL_QUESTIONS) {
        setGameState('results');
        return;
    }
    
    setCurrentQuestionIndex(nextIndex);
  }, [currentQuestionIndex, questions.length, gameMode, handleTurnEnd]);

  const handleStartPlayerTurn = useCallback(() => {
      setTimeLeft(initialTimerDuration);
      setGameState('playing');
      startTimer();
  }, [initialTimerDuration, startTimer]);

  const handleAnswer = useCallback((selectedOption: string) => {
    const question = questions[currentQuestionIndex];
    if (!question) return;
    const isCorrect = selectedOption === question.correctAnswer.name;
    
    if (gameMode === 'party') {
      if (isCorrect) {
        setPlayers(prevPlayers => prevPlayers.map((p, index) => 
          index === currentPlayerIndex ? { ...p, score: p.score + 1 } : p
        ));
      }
      handleNext();
    } else {
      setAnswerRecords(prev => [...prev, { question, userAnswer: selectedOption, isCorrect }]);
      if (gameMode === 'timed') {
        handleNext();
      }
    }
  }, [currentQuestionIndex, questions, gameMode, currentPlayerIndex, handleNext]);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const currentPlayer = useMemo(() => players[currentPlayerIndex], [players, currentPlayerIndex]);

  const renderContent = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen 
          onStartClassicTimed={startClassicOrTimedGame} 
          onStartParty={() => setGameState('party-setup')} 
        />;
      case 'party-setup':
        return <PartySetupScreen onStart={startPartyGame} onBack={() => setGameState('welcome')} />;
      case 'turn-start':
        return <TurnStartScreen playerName={currentPlayer.name} onContinue={handleStartPlayerTurn} />;
      case 'playing':
        return currentQuestion ? (
          <GameScreen
            key={currentQuestionIndex}
            question={currentQuestion}
            onAnswer={handleAnswer}
            onNext={handleNext}
            gameMode={gameMode}
            // Classic/Timed props
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={gameMode === 'classic' ? TOTAL_QUESTIONS : answerRecords.length + 1}
            timeLeft={timeLeft}
            timerDuration={initialTimerDuration}
            // Party props
            playerName={currentPlayer?.name}
          />
        ) : null;
      case 'results':
        const classicTimedScore = answerRecords.filter(ar => ar.isCorrect).length;
        return <ResultScreen
          onPlayAgain={resetGame}
          gameMode={gameMode}
          // Classic/Timed props
          score={classicTimedScore}
          totalQuestions={answerRecords.length}
          answerRecords={answerRecords}
          // Party props
          players={players}
        />;
      default:
        return <WelcomeScreen 
          onStartClassicTimed={startClassicOrTimedGame} 
          onStartParty={() => setGameState('party-setup')}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;