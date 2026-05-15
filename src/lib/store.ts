import { create } from 'zustand';

export type GameState = 'START' | 'REGISTRATION' | 'PLAYING' | 'GOAL' | 'SAVE' | 'MISS' | 'TOURNAMENT_RESULTS';
export type GoalkeeperType = 'DIBU' | 'NEUER';
export type GameMode = 'INDIVIDUAL' | 'TEAM';

interface Player {
  name: string;
  score: number;
  attempts: number;
}

interface GameStore {
  gameState: GameState;
  gameMode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  selectedGoalkeeper: GoalkeeperType;
  maxAttempts: number;
  brandingName: string;
  strikerScore: number;
  goalkeeperScore: number;

  setGameState: (state: GameState) => void;
  setGameMode: (mode: GameMode) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentPlayerIndex: (index: number) => void;
  setSelectedGoalkeeper: (gk: GoalkeeperType) => void;
  setMaxAttempts: (count: number) => void;
  addGoal: (playerIndex: number) => void;
  addAttempt: (playerIndex: number) => void;
  addGoalkeeperSave: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'START',
  gameMode: 'INDIVIDUAL',
  players: [],
  currentPlayerIndex: 0,
  selectedGoalkeeper: 'DIBU',
  maxAttempts: 3,
  brandingName: 'Transelo',
  strikerScore: 0,
  goalkeeperScore: 0,

  setGameState: (state) => set({ gameState: state }),
  setGameMode: (mode) => set({ gameMode: mode }),
  setPlayers: (players) => set({ players }),
  setCurrentPlayerIndex: (index) => set({ currentPlayerIndex: index }),
  setSelectedGoalkeeper: (gk) => set({ selectedGoalkeeper: gk }),
  setMaxAttempts: (count) => set({ maxAttempts: count }),
  
  addGoal: (playerIndex) => set((state) => {
    if (state.gameMode === 'INDIVIDUAL') {
      return { strikerScore: state.strikerScore + 1 };
    }
    const newPlayers = [...state.players];
    if (newPlayers[playerIndex]) {
      newPlayers[playerIndex].score += 1;
    }
    return { players: newPlayers };
  }),

  addGoalkeeperSave: () => set((state) => ({ goalkeeperScore: state.goalkeeperScore + 1 })),

  addAttempt: (playerIndex) => set((state) => {
    if (state.gameMode === 'INDIVIDUAL') {
      return { currentPlayerIndex: state.currentPlayerIndex }; // Individual doesn't rotate players
    }
    const newPlayers = [...state.players];
    if (newPlayers[playerIndex]) {
      newPlayers[playerIndex].attempts += 1;
    }
    return { players: newPlayers };
  }),

  resetGame: () => set({
    gameState: 'START',
    gameMode: 'INDIVIDUAL',
    players: [],
    currentPlayerIndex: 0,
    selectedGoalkeeper: 'DIBU',
    strikerScore: 0,
    goalkeeperScore: 0,
    maxAttempts: 3,
  }),
}));

