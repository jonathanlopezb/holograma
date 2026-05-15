import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoalOverlay() {
  const { gameState, players, currentPlayerIndex, selectedGoalkeeper, gameMode, strikerScore, goalkeeperScore } = useGameStore();

  if (gameState !== 'GOAL' && gameState !== 'SAVE') return null;

  const isGoal = gameState === 'GOAL';
  const player = players[currentPlayerIndex];
  const gkName = selectedGoalkeeper === 'DIBU' ? 'El Dibu' : 'Neuer';

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none overflow-hidden">
        {/* Flash Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 ${
            isGoal
              ? 'bg-[radial-gradient(circle,rgba(255,220,0,0.3)_0%,transparent_70%)]'
              : 'bg-[radial-gradient(circle,rgba(0,150,255,0.3)_0%,transparent_70%)]'
          }`}
        />

        {/* Floating Text Particles (Conceptual) */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50, rotate: -10 }}
            animate={{ scale: 1.2, opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="text-center"
          >
            <h2 
              className={`text-[15vw] font-black italic tracking-tighter leading-none mb-2 ${
                isGoal ? 'text-yellow-400' : 'text-cyan-400'
              }`}
              style={{
                textShadow: isGoal 
                  ? '0 0 50px rgba(255,220,0,0.8), 0 0 100px rgba(255,150,0,0.4)' 
                  : '0 0 50px rgba(0,242,255,0.8), 0 0 100px rgba(0,100,255,0.4)',
                WebkitTextStroke: '2px rgba(255,255,255,0.2)'
              }}
            >
              {isGoal ? '¡GOOOOL!' : '¡ATAJADA!'}
            </h2>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-2xl md:text-3xl font-black text-white uppercase tracking-[0.3em] bg-black/40 px-8 py-2 rounded-full backdrop-blur-md border border-white/10">
                {isGoal ? `${player?.name || 'Jugador'} anotó` : `${gkName} salvó`}
              </span>
            </motion.div>
          </motion.div>
          
          {/* Action Line Decorations */}
          <motion.div 
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             className={`h-1 w-screen absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 -z-10 ${isGoal ? 'bg-yellow-400' : 'bg-cyan-400'} opacity-30`}
          />
        </div>
      </div>
    </AnimatePresence>
  );
}

