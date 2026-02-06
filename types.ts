
export type Player = 'O' | 'X';
export type CellValue = Player | '';
export type GameMode = 'pvc' | 'pvp';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AudioSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
}

export interface GameState {
  board: CellValue[];
  active: boolean;
  currentPlayer: Player;
  mode: GameMode;
  difficulty: Difficulty;
  scores: { O: number; X: number };
  audioSettings: AudioSettings;
}

export type SoundType = 'click' | 'ui_click' | 'win' | 'draw' | 'start' | 'transition';
