'use client';

import { useEffect } from 'react';
import { useGameEngine, Direction, Height } from '@/hooks/useGameEngine';
import { useGameStore } from '@/lib/store';
import { Keyboard, MousePointer2 } from 'lucide-react';

export default function ManualControls() {
  const { shoot } = useGameEngine();
  const { gameState } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;

      let dir: Direction | null = null;
      let height: Height = 'mid';

      if (e.key === 'ArrowLeft') dir = 'left';
      if (e.key === 'ArrowUp') dir = 'center';
      if (e.key === 'ArrowRight') dir = 'right';

      if (dir) {
        // Calculate a simulated impulse for the Ball.tsx listener
        const impulseMap: Record<Direction, { dx: number; dy: number; dz: number; spin: number }> = {
          left:   { dx: -1.5, dy: 1.2, dz: -6, spin: -0.5 },
          center: { dx: 0,    dy: 1.5, dz: -7, spin: 0 },
          right:  { dx: 1.5,  dy: 1.2, dz: -6, spin: 0.5 },
        };

        window.dispatchEvent(new CustomEvent('ball-shoot', { detail: impulseMap[dir] }));
        shoot({ direction: dir, height });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, shoot]);

  if (gameState !== 'PLAYING') return null;

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('ball-shoot', { detail: { dx: -1.5, dy: 1.2, dz: -6, spin: -0.5 } }));
            shoot({ direction: 'left', height: 'mid' });
          }}
          className="px-6 py-3 bg-white/10 hover:bg-accent hover:text-black border border-white/20 rounded-xl font-black transition-all backdrop-blur-md uppercase text-xs tracking-widest"
        >
          Izquierda
        </button>
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('ball-shoot', { detail: { dx: 0, dy: 1.5, dz: -7, spin: 0 } }));
            shoot({ direction: 'center', height: 'high' });
          }}
          className="px-6 py-3 bg-white/10 hover:bg-accent hover:text-black border border-white/20 rounded-xl font-black transition-all backdrop-blur-md uppercase text-xs tracking-widest"
        >
          Centro
        </button>
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('ball-shoot', { detail: { dx: 1.5, dy: 1.2, dz: -6, spin: 0.5 } }));
            shoot({ direction: 'right', height: 'mid' });
          }}
          className="px-6 py-3 bg-white/10 hover:bg-accent hover:text-black border border-white/20 rounded-xl font-black transition-all backdrop-blur-md uppercase text-xs tracking-widest"
        >
          Derecha
        </button>
      </div>
      <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-tighter">
        <Keyboard className="w-3 h-3" />
        Usa las flechas del teclado o los botones
      </div>
    </div>
  );
}
