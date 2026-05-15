'use client';

import { useGameStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function HUD() {
  const { gameState, players, currentPlayerIndex, brandingName, selectedGoalkeeper } = useGameStore();
  const [camStatus, setCamStatus] = useState('SEARCHING');

  useEffect(() => {
    const handleStatus = (e: CustomEvent) => setCamStatus(e.detail.status);
    window.addEventListener('camera-status', handleStatus as EventListener);
    return () => window.removeEventListener('camera-status', handleStatus as EventListener);
  }, []);
  const currentPlayer = players[currentPlayerIndex];
  const gkName = selectedGoalkeeper === 'DIBU' ? '🧤 El Dibu Martínez' : '🧤 Manuel Neuer';

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-20">
      {/* ── TOP BAR ── */}
      <div className="flex justify-between items-start">
        {/* Brand */}
        <div
          className="glass px-5 py-3 rounded-2xl flex items-center gap-3"
          style={{ border: '1px solid rgba(0,242,255,0.2)' }}
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-accent/60 tracking-[0.25em] uppercase">
              Powered by
            </span>
            <span
              className="text-lg font-black tracking-wider text-white uppercase"
              style={{ textShadow: '0 0 12px rgba(0,242,255,0.4)' }}
            >
              {brandingName}
            </span>
            <span className="text-[9px] text-white/30 tracking-[0.2em] uppercase">
              World Cup Edition 2026
            </span>
          </div>
        </div>

        {/* Right cluster: GK + score */}
        <div className="flex flex-col items-end gap-2">
          {/* Goalkeeper indicator */}
          <div className="glass px-4 py-2 rounded-xl">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Opponent</p>
            <p className="text-sm font-bold text-white">{gkName}</p>
          </div>

          {/* Score */}
          {currentPlayer && (
            <div className="glass px-6 py-3 rounded-2xl text-right">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                {currentPlayer.name}
              </p>
              <p
                className="text-4xl font-black text-white tabular-nums"
                style={{ textShadow: '0 0 12px rgba(255,255,255,0.3)' }}
              >
                {currentPlayer.score}
                <span className="text-white/25 text-2xl">/{currentPlayer.attempts}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM STATUS BAR ── */}
      <div className="flex justify-between items-end">
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${camStatus === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : camStatus === 'SEARCHING' ? 'bg-yellow-500 animate-spin' : 'bg-red-500'}`} />
          <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">
            Cámara: {camStatus}
          </span>
        </div>

        {gameState === 'PLAYING' && (
          <div className="glass px-4 py-2 rounded-xl">
            <p className="text-[10px] text-white/40 uppercase tracking-widest text-center">Dispara</p>
            <p className="text-xs text-white/60 font-mono">← ↑ → / A S D</p>
          </div>
        )}
      </div>
    </div>
  );
}
