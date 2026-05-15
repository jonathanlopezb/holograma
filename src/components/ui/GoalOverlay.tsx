'use client';

import { useGameStore } from '@/lib/store';

export default function GoalOverlay() {
  const { gameState, players, currentPlayerIndex, setGameState, selectedGoalkeeper } = useGameStore();

  if (gameState !== 'GOAL' && gameState !== 'SAVE') return null;

  const isGoal = gameState === 'GOAL';
  const player = players[currentPlayerIndex];
  const gkName = selectedGoalkeeper === 'DIBU' ? 'El Dibu' : 'Manuel Neuer';

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
      {/* Radial flash overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isGoal
            ? 'bg-[radial-gradient(circle,rgba(255,220,0,0.15)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(circle,rgba(0,150,255,0.15)_0%,transparent_70%)]'
        }`}
      />

      {/* Main result text */}
      <div className="relative text-center space-y-4">
        {isGoal ? (
          <>
            <div
              className="text-[10vw] font-black italic text-yellow-300 leading-none"
              style={{
                textShadow: '0 0 40px rgba(255,220,0,0.8), 0 0 80px rgba(255,150,0,0.4)',
                animation: 'goalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              ¡GOOOOL!
            </div>
            <div className="text-2xl font-bold text-white/80 tracking-widest uppercase">
              {player?.name} marca 🎯
            </div>
          </>
        ) : (
          <>
            <div
              className="text-[8vw] font-black italic text-cyan-400 leading-none"
              style={{
                textShadow: '0 0 40px rgba(0,242,255,0.8)',
                animation: 'goalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              ¡ATAJADÓN!
            </div>
            <div className="text-2xl font-bold text-white/80 tracking-widest uppercase">
              {gkName} lo detiene 🧤
            </div>
          </>
        )}

        {/* Score display */}
        {player && (
          <div className="mt-6 glass px-12 py-4 rounded-2xl inline-block">
            <p className="text-sm text-white/50 uppercase tracking-widest">Score</p>
            <p className="text-5xl font-black text-white">
              {player.score} <span className="text-white/30">/</span> {player.attempts}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes goalPop {
          0% { transform: scale(0.3) rotate(-5deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
