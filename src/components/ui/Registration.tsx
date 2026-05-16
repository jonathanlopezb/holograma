import { useState } from 'react';
import { useGameStore, GoalkeeperType } from '@/lib/store';
import { cn } from '@/lib/utils';
import { User, Users, Shield, Zap, Target, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="fixed inset-0 z-50 bg-[#020202]/90 backdrop-blur-2xl flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.2),transparent_70%)]" />
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      {/* Main UI Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative max-w-2xl w-full p-1 md:p-[1px] rounded-[3rem] bg-gradient-to-br from-accent/50 via-white/10 to-accent/50 shadow-[0_0_50px_rgba(0,242,255,0.15)]"
      >
        <div className="bg-[#050505] rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20 opacity-20" />
          
          {/* Decorative Corner Borders */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-accent/40 rounded-tl-xl" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-xl" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-xl" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-accent/40 rounded-br-xl" />

          <div className="relative z-10 space-y-10">
            <div className="text-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4"
              >
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-black text-accent tracking-[0.4em] uppercase">Penalty Shootout</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-black text-white text-glow tracking-tighter uppercase italic leading-none">
                {brandingName}
              </h1>
            </div>

            <div className="space-y-8">
              {/* Mode Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 ml-2">
                  <Target className="w-4 h-4 text-accent" />
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Tipo de Competencia</label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleModeChange('individual')}
                    className={cn(
                      "relative group flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all overflow-hidden",
                      mode === 'individual' ? "bg-accent/10 border-accent text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    )}
                  >
                    <User className={cn("w-6 h-6", mode === 'individual' ? "text-accent" : "text-white/20")} />
                    <span className="font-black uppercase text-xs tracking-widest">Duelo 1v1</span>
                    {mode === 'individual' && <motion.div layoutId="mode-bg" className="absolute inset-0 bg-accent/5 -z-10" />}
                  </button>
                  <button 
                    onClick={() => handleModeChange('teams')}
                    className={cn(
                      "relative group flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all overflow-hidden",
                      mode === 'teams' ? "bg-accent/10 border-accent text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    )}
                  >
                    <Users className={cn("w-6 h-6", mode === 'teams' ? "text-accent" : "text-white/20")} />
                    <span className="font-black uppercase text-xs tracking-widest">Torneo</span>
                    {mode === 'teams' && <motion.div layoutId="mode-bg" className="absolute inset-0 bg-accent/5 -z-10" />}
                  </button>
                </div>
              </div>

              {/* Name Inputs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 ml-2">
                  <Target className="w-4 h-4 text-accent" />
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                    Nombres de Jugadores
                  </label>
                </div>
                <div className="space-y-3">
                  {names.map((n, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative group"
                    >
                      <input 
                        type="text" 
                        value={n}
                        onChange={(e) => updateName(i, e.target.value)}
                        placeholder={mode === 'individual' ? "NOMBRE DEL JUGADOR" : `JUGADOR 0${i+1}`}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-8 py-5 text-xl font-black text-white placeholder:text-white/5 focus:outline-none focus:border-accent/50 transition-all uppercase"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 font-black italic text-sm group-focus-within:text-accent/40 transition-colors">
                        PLAYER_{i+1}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Goalkeeper Selection Removed as per user request */}
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              disabled={!isFormValid}
              className="w-full relative group overflow-hidden"
            >

              <div className="absolute inset-0 bg-accent animate-pulse opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-white text-black font-black text-xl py-6 rounded-xl flex items-center justify-center gap-3 transition-colors group-hover:bg-accent group-disabled:bg-white/10 group-disabled:text-white/20">
                <Trophy className="w-6 h-6" />
                SALTAR A LA CANCHA
              </div>
            </motion.button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}


