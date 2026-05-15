'use client';

import { useState } from 'react';
import { useGameStore, GoalkeeperType } from '@/lib/store';
import { cn } from '@/lib/utils';
import { User, Users, Shield, Zap } from 'lucide-react';

export default function Registration() {
  const { setGameState, setPlayers, setSelectedGoalkeeper, setGameMode, brandingName } = useGameStore();
  const [names, setNames] = useState<string[]>(['']);
  const [gk, setGk] = useState<GoalkeeperType>('DIBU');
  const [mode, setMode] = useState<'individual' | 'teams'>('individual');

  const handleModeChange = (newMode: 'individual' | 'teams') => {
    setMode(newMode);
    if (newMode === 'individual') {
      setNames([names[0] || '']);
    } else {
      setNames([names[0] || '', '', '']);
    }
  };

  const updateName = (index: number, val: string) => {
    const newNames = [...names];
    newNames[index] = val;
    setNames(newNames);
  };

  const handleStart = () => {
    if (names.some(n => !n)) return;
    
    setGameMode(mode === 'individual' ? 'INDIVIDUAL' : 'TEAM');
    setPlayers(names.map(name => ({ name, score: 0, attempts: 0 })));
    setSelectedGoalkeeper(gk);
    setGameState('PLAYING');
  };

  const isFormValid = names.every(n => n.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass max-w-2xl w-full p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border-white/10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -ml-32 -mb-32" />

        <div className="relative z-10 space-y-10">
          <div className="text-center">
            <h2 className="text-[10px] font-black text-accent tracking-[0.5em] uppercase mb-2">Bienvenido a</h2>
            <h1 className="text-4xl md:text-5xl font-black text-white text-glow tracking-tight uppercase">
              {brandingName}
            </h1>
          </div>

          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] ml-2">Modo de Juego</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleModeChange('individual')}
                  className={cn(
                    "flex items-center justify-center gap-3 px-6 py-5 rounded-2xl border transition-all",
                    mode === 'individual' ? "bg-accent/20 border-accent text-white shadow-[0_0_20px_rgba(0,242,255,0.2)]" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  )}
                >
                  <User className="w-5 h-5" />
                  <span className="font-bold uppercase text-xs tracking-widest">Individual</span>
                </button>
                <button 
                  onClick={() => handleModeChange('teams')}
                  className={cn(
                    "flex items-center justify-center gap-3 px-6 py-5 rounded-2xl border transition-all",
                    mode === 'teams' ? "bg-accent/20 border-accent text-white shadow-[0_0_20px_rgba(0,242,255,0.2)]" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  )}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-bold uppercase text-xs tracking-widest">Equipos</span>
                </button>
              </div>
            </div>

            {/* Name Inputs */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] ml-2">
                {mode === 'individual' ? 'Nombre del Jugador' : 'Nombres del Equipo'}
              </label>
              <div className="space-y-3">
                {names.map((n, i) => (
                  <div key={i} className="relative group">
                    <input 
                      type="text" 
                      value={n}
                      onChange={(e) => updateName(i, e.target.value)}
                      placeholder={mode === 'individual' ? "INGRESA TU NOMBRE" : `JUGADOR ${i+1}`}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-accent/50 transition-all group-hover:bg-white/10"
                    />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full scale-y-0 group-focus-within:scale-y-100 transition-transform origin-center" />
                  </div>
                ))}
              </div>
            </div>

            {/* Goalkeeper Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] ml-2">Elige tu Oponente</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setGk('DIBU')}
                  className={cn(
                    "flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border transition-all",
                    gk === 'DIBU' ? "bg-accent/20 border-accent text-white shadow-[0_0_20px_rgba(0,242,255,0.2)]" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  )}
                >
                  <Zap className={cn("w-4 h-4", gk === 'DIBU' ? "text-accent" : "text-white/20")} />
                  <span className="font-bold text-xs uppercase">EL DIBU</span>
                </button>
                <button 
                  onClick={() => setGk('NEUER')}
                  className={cn(
                    "flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border transition-all",
                    gk === 'NEUER' ? "bg-accent/20 border-accent text-white shadow-[0_0_20px_rgba(0,242,255,0.2)]" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  )}
                >
                  <Shield className={cn("w-4 h-4", gk === 'NEUER' ? "text-accent" : "text-white/20")} />
                  <span className="font-bold text-xs uppercase">NEUER</span>
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStart}
            disabled={!isFormValid}
            className="w-full bg-white text-black font-black text-xl py-6 rounded-2xl hover:bg-accent hover:text-black transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed shadow-[0_10px_40px_rgba(255,255,255,0.1)] hover:shadow-accent/40"
          >
            INICIAR COMPETENCIA
          </button>
        </div>
      </div>
    </div>
  );
}

