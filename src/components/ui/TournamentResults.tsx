import { useGameStore } from '@/lib/store';
import { Trophy, RotateCcw, User, Shield, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TournamentResults() {
  const { gameState, gameMode, players, resetGame, brandingName, strikerScore, goalkeeperScore, selectedGoalkeeper } = useGameStore();

  if (gameState !== 'TOURNAMENT_RESULTS') return null;

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const teamWinner = sorted[0];
  const gkName = selectedGoalkeeper === 'DIBU' ? 'El Dibu' : 'Neuer';
  const isIndividual = gameMode === 'INDIVIDUAL';
  const individualWinner = strikerScore > goalkeeperScore ? players[0]?.name : gkName;
  const isDraw = strikerScore === goalkeeperScore;
  
  const allHighScores = sorted.filter(p => teamWinner && p.score === teamWinner.score && p.score > 0);
  const isTeamTie = allHighScores.length > 1;


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="glass max-w-2xl w-full p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] text-center space-y-8 relative overflow-hidden border border-white/10"
        >
          {/* Animated Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
          
          <div className="space-y-2">
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">{brandingName}</p>
            <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">Resultado Final</h2>
          </div>

          {/* Winner Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center border-4 border-white/20 relative z-10 shadow-2xl">
                  <Trophy className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
            </motion.div>

            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
                {isIndividual ? (isDraw ? '¡EMPATE!' : '¡GANADOR!') : (isTeamTie ? '¡EMPATE!' : '¡CAMPEÓN!')}
              </h1>
              <p className="text-2xl md:text-3xl font-black text-yellow-400 uppercase tracking-tight">
                {isIndividual 
                  ? (isDraw ? 'Duelo muy parejo' : individualWinner) 
                  : (isTeamTie ? 'Varios ganadores' : (teamWinner?.score === 0 ? 'Nadie anotó' : teamWinner?.name))
                }
              </p>
            </div>
          </div>


          {/* Score Board */}
          {isIndividual ? (
            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5">
                <User className="w-6 h-6 text-white/40 mx-auto mb-2" />
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{players[0]?.name}</p>
                <p className="text-4xl font-black text-white">{strikerScore}</p>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5">
                <Shield className="w-6 h-6 text-white/40 mx-auto mb-2" />
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{gkName}</p>
                <p className="text-4xl font-black text-accent">{goalkeeperScore}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {sorted.map((p, i) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  key={p.name}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${
                    i === 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xl font-black ${i === 0 ? 'text-yellow-400' : 'text-white/20'}`}>#{i + 1}</span>
                    <span className="font-black text-white uppercase tracking-tight">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white text-2xl">{p.score}</span>
                    <span className="text-white/20 text-sm font-bold ml-1">GOLES</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={resetGame}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-black text-xl py-6 rounded-2xl hover:bg-accent transition-all active:scale-[0.98] shadow-2xl hover:shadow-accent/50 group"
            >
              <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              NUEVA COMPETENCIA
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

