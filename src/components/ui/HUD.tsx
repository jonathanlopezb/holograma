'use client';

import { useGameStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function HUD() {
  const { gameState, gameMode, players, currentPlayerIndex, brandingName, selectedGoalkeeper, resetGame, strikerScore, goalkeeperScore } = useGameStore();
  const [camStatus, setCamStatus] = useState('SEARCHING');

  useEffect(() => {
    const handleStatus = (e: CustomEvent) => setCamStatus(e.detail.status);
    window.addEventListener('camera-status', handleStatus as EventListener);
    return () => window.removeEventListener('camera-status', handleStatus as EventListener);
  }, []);

  const currentPlayer = players[currentPlayerIndex];
  const gkName = selectedGoalkeeper === 'DIBU' ? '🧤 El Dibu' : '🧤 Neuer';

  return (
    <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between z-20">
      {/* ── TOP BAR ── */}
      <div className="flex justify-between items-start">
        {/* Brand */}
        <div className="flex flex-col gap-1">
          <div className="glass px-4 py-3 rounded-2xl flex items-center gap-3 border border-white/10">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-accent tracking-[0.3em] uppercase">Powered by</span>
              <span className="text-sm font-black tracking-wider text-white uppercase">{brandingName}</span>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="glass px-3 py-1.5 rounded-xl flex items-center gap-2 self-start border border-white/5">
            <div className={`w-1.5 h-1.5 rounded-full ${camStatus === 'CONNECTED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
            <span className="text-[8px] font-mono text-white/40 tracking-wider uppercase">CAM: {camStatus}</span>
          </div>
        </div>

        {/* Center: Scoreboard (Cinematic) */}
        <div className="flex items-center gap-4">
          {gameMode === 'INDIVIDUAL' ? (
            <div className="glass px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-6 shadow-2xl">
              <div className="text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">{players[0]?.name || 'Jugador'}</p>
                <p className="text-4xl font-black text-white">{strikerScore}</p>
              </div>
              <div className="h-12 w-[1px] bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">{gkName}</p>
                <p className="text-4xl font-black text-accent">{goalkeeperScore}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="glass px-8 py-4 rounded-3xl border border-accent/20 flex flex-col items-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent/30 animate-pulse" />
                <p className="text-[10px] text-accent font-black uppercase tracking-[0.4em] mb-1">Turno de Cobro</p>
                <p className="text-3xl font-black text-white uppercase tracking-tight">{currentPlayer?.name}</p>
              </div>
              
              {/* Other players mini-scores */}
              <div className="flex gap-2">
                {players.map((p, i) => (
                  <div key={i} className={`glass px-3 py-1 rounded-lg border transition-all ${i === currentPlayerIndex ? 'border-accent bg-accent/10' : 'border-white/5 opacity-40'}`}>
                    <span className="text-[10px] font-bold text-white uppercase">{p.score}/{p.attempts}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side: Options */}
        <button 
          onClick={resetGame}
          className="pointer-events-auto glass p-3 rounded-2xl border border-white/10 hover:bg-white/5 transition-all group"
        >
          <X className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* ── BOTTOM BAR (Optional Info) ── */}
      <div className="flex justify-center">
        {gameState === 'PLAYING' && (
          <div className="glass px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 animate-bounce">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Patea ahora!</span>
          </div>
        )}
      </div>
    </div>
  );
}

