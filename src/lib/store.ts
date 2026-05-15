import { create } from 'zustand';

export type GameState = 'START' | 'REGISTRATION' | 'PLAYING' | 'GOAL' | 'SAVE' | 'MISS' | 'TOURNAMENT_RESULTS';
export type GoalkeeperType = 'DIBU' | 'NEUER';

interface Player {
  name: string;
  score: number;
  attempts: number;
}

interface GameStore {
  gameState: GameState;
  players: Player[];
  currentPlayerIndex: number;
  selectedGoalkeeper: GoalkeeperType;
  maxAttempts: number;
  brandingName: string;

  setGameState: (state: GameState) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentPlayerIndex: (index: number) => void;
  setSelectedGoalkeeper: (gk: GoalkeeperType) => void;
  addGoal: (playerIndex: number) => void;
  addAttempt: (playerIndex: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'START',
  players: [],
  currentPlayerIndex: 0,
  selectedGoalkeeper: 'DIBU',
  maxAttempts: 5,
  brandingName: 'Transelo Eventos',

  setGameState: (state) => set({ gameState: state }),
  setPlayers: (players) => set({ players }),
  setCurrentPlayerIndex: (index) => set({ currentPlayerIndex: index }),
  setSelectedGoalkeeper: (gk) => set({ selectedGoalkeeper: gk }),
  
  addGoal: (playerIndex) => set((state) => {
    const newPlayers = [...state.players];
    newPlayers[playerIndex].score += 1;
    return { players: newPlayers };
  }),

  addAttempt: (playerIndex) => set((state) => {
    const newPlayers = [...state.players];
    newPlayers[playerIndex].attempts += 1;
    return { players: newPlayers };
  }),

  resetGame: () => set({
    gameState: 'START',
    players: [],
    currentPlayerIndex: 0,
    selectedGoalkeeper: 'DIBU'
  }),
}));
