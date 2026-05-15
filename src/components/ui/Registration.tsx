'use client';

import { useState } from 'react';
import { useGameStore, GoalkeeperType } from '@/lib/store';
import { cn } from '@/lib/utils';
import { User, Users, Shield, Zap } from 'lucide-react';

export default function Registration() {
  const { setGameState, setPlayers, setSelectedGoalkeeper, brandingName } = useGameStore();
  const [name, setName] = useState('');
  const [gk, setGk] = useState<GoalkeeperType>('DIBU');
  const [mode, setMode] = useState<'individual' | 'teams'>('individual');

  const handleStart = () => {
    if (!name) return;
    setPlayers([{ name, score: 0, attempts: 0 }]);
    setSelectedGoalkeeper(gk);
    setGameState('PLAYING');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass max-w-2xl w-full p-12 rounded-[3rem] border-white/10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -ml-32 -mb-32" />

        <div className="relative z-10 space-y-12">
          <div className="text-center">
            <h2 className="text-sm font-black text-accent tracking-[0.4em] uppercase mb-2">Bienvenido a</h2>
            <h1 className="text-5xl font-black text-white text-glow tracking-tight uppercase">
              {brandingName}
            </h1>
          </div>

          <div className="space-y-8">
            {/* Name Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-4">Nombre del Jugador</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="INGRESA TU NOMBRE"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-2xl font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-accent/50 transition-all"
              />
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Goalkeeper Selection */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-2">Elige tu Oponente</label>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setGk('DIBU')}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all",
                      gk === 'DIBU' ? "bg-accent/20 border-accent text-white" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    )}
                  >
                    <Zap className={cn("w-5 h-5", gk === 'DIBU' ? "text-accent" : "text-white/20")} />
                    <span className="font-bold">EL DIBU</span>
                  </button>
                  <button 
                    onClick={() => setGk('NEUER')}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all",
                      gk === 'NEUER' ? "bg-accent/20 border-accent text-white" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    )}
                  >
                    <Shield className={cn("w-5 h-5", gk === 'NEUER' ? "text-accent" : "text-white/20")} />
                    <span className="font-bold">MANUEL NEUER</span>
                  </button>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-2">Modo de Juego</label>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setMode('individual')}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all",
                      mode === 'individual' ? "bg-accent/20 border-accent text-white" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    )}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-bold uppercase text-sm">Individual</span>
                  </button>
                  <button 
                    onClick={() => setMode('teams')}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all",
                      mode === 'teams' ? "bg-accent/20 border-accent text-white" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    )}
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-bold uppercase text-sm">Torneo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStart}
            disabled={!name}
            className="w-full bg-white text-black font-black text-xl py-6 rounded-2xl hover:bg-accent hover:text-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            INICIAR COMPETENCIA
          </button>
        </div>
      </div>
    </div>
  );
}
