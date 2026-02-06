
import { Player } from './types';

export const WIN_CONDITIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]           // Diagonals
];

export const COLORS = {
  playerO: '#00d4ff',
  playerX: '#ff0055',
  bg: '#0d0221',
  surface: '#1a0b3c',
  line: '#261b4d',
};

export const INITIAL_BOARD = Array(9).fill('');
