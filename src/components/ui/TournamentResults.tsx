'use client';

import { useGameStore } from '@/lib/store';
import { Trophy, RotateCcw } from 'lucide-react';

export default function TournamentResults() {
  const { gameState, players, resetGame, brandingName } = useGameStore();

  if (gameState !== 'TOURNAMENT_RESULTS') return null;

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center">
      <div className="glass max-w-2xl w-full p-12 rounded-[3rem] text-center space-y-10">
        {/* Branding */}
        <p className="text-xs font-bold text-accent uppercase tracking-[0.4em]">{brandingName}</p>

        {/* Trophy */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/40">
            <Trophy className="w-12 h-12 text-yellow-400" />
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-black text-white mb-2">¡CAMPEÓN!</h1>
          <p className="text-3xl font-bold text-yellow-300">{winner?.name}</p>
          <p className="text-lg text-white/50 mt-2">
            {winner?.score} goles de {winner?.attempts} intentos
          </p>
        </div>

        {/* All players ranking */}
        {sorted.length > 1 && (
          <div className="space-y-3">
            {sorted.map((p, i) => (
              <div
                key={p.name}
                className={`flex items-center justify-between px-6 py-3 rounded-2xl ${
                  i === 0 ? 'bg-yellow-500/20 border border-yellow-500/40' : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-white/30">#{i + 1}</span>
                  <span className="font-bold text-white">{p.name}</span>
                </div>
                <span className="font-black text-white text-xl">
                  {p.score}/{p.attempts}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={resetGame}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-black text-lg py-5 rounded-2xl hover:bg-accent transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-5 h-5" />
          NUEVA COMPETENCIA
        </button>
      </div>
    </div>
  );
}
