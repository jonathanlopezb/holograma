'use client';

/**
 * ShootControls — Keyboard / Touch / Click shoot UI for the Giant Screen.
 * Arrows or swipe LEFT / RIGHT / UP or click zones trigger a shot.
 * The operator can also press A/S/D to trigger left/center/right shots manually.
 */

import { useEffect, useCallback } from 'react';
import { useGameEngine, Direction } from '@/hooks/useGameEngine';
import { useGameStore } from '@/lib/store';

function triggerShot(direction: Direction) {
  // Dispatch ball shoot impulse
  const impulseMap: Record<Direction, { dx: number; dy: number; dz: number; spin: number }> = {
    left:   { dx: -1.2, dy: 0.8, dz: -6, spin: -0.5 },
    center: { dx: 0,    dy: 1.2, dz: -7, spin: 0 },
    right:  { dx: 1.2,  dy: 0.8, dz: -6, spin: 0.5 },
  };
  window.dispatchEvent(new CustomEvent('ball-shoot', { detail: impulseMap[direction] }));
}

export default function ShootControls() {
  const { shoot } = useGameEngine();
  const { gameState } = useGameStore();

  const handleShoot = useCallback((direction: Direction) => {
    if (gameState !== 'PLAYING') return;
    const height = direction === 'center' ? 'high' : 'low';
    triggerShot(direction);
    shoot({ direction, height });
  }, [shoot, gameState]);

  // Keyboard controls: A = left, S = center, D = right / ArrowKeys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleShoot('left');
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleShoot('right');
      if (e.key === 'ArrowUp' || e.key === 's' || e.key === 'S') handleShoot('center');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleShoot]);

  if (gameState !== 'PLAYING') return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 pointer-events-auto">
      {/* Left */}
      <button
        id="shoot-left"
        onClick={() => handleShoot('left')}
        className="w-20 h-20 rounded-full glass border border-white/20 text-white font-black text-2xl hover:bg-white/10 active:scale-95 transition-all shadow-lg"
        aria-label="Shoot left"
      >
        ←
      </button>

      {/* Center */}
      <button
        id="shoot-center"
        onClick={() => handleShoot('center')}
        className="w-24 h-24 rounded-full bg-white text-black font-black text-xl hover:bg-accent active:scale-95 transition-all shadow-xl"
        aria-label="Shoot center / up"
      >
        ↑
      </button>

      {/* Right */}
      <button
        id="shoot-right"
        onClick={() => handleShoot('right')}
        className="w-20 h-20 rounded-full glass border border-white/20 text-white font-black text-2xl hover:bg-white/10 active:scale-95 transition-all shadow-lg"
        aria-label="Shoot right"
      >
        →
      </button>
    </div>
  );
}
