
import { CellValue, Player, Difficulty } from '../types';
import { WIN_CONDITIONS } from '../constants';

const checkWin = (board: CellValue[], player: Player): boolean => {
  return WIN_CONDITIONS.some(combo => combo.every(idx => board[idx] === player));
};

const getAvailableSpots = (board: CellValue[]): number[] => {
  return board.map((v, i) => v === '' ? i : null).filter((v): v is number => v !== null);
};

const minimax = (board: CellValue[], player: Player): { score: number; index?: number } => {
  const availSpots = getAvailableSpots(board);

  if (checkWin(board, 'O')) return { score: -10 };
  if (checkWin(board, 'X')) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves: { score: number; index: number }[] = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = { index: availSpots[i], score: 0 };
    board[availSpots[i]] = player;

    if (player === 'X') {
      const result = minimax(board, 'O');
      move.score = result.score;
    } else {
      const result = minimax(board, 'X');
      move.score = result.score;
    }

    board[availSpots[i]] = '';
    moves.push(move);
  }

  let bestMove = 0;
  if (player === 'X') {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
};

export const getComputerMove = (board: CellValue[], difficulty: Difficulty): number => {
  const avail = getAvailableSpots(board);
  
  const isRandom = 
    difficulty === 'easy' || 
    (difficulty === 'medium' && Math.random() < 0.4);

  if (isRandom) {
    return avail[Math.floor(Math.random() * avail.length)];
  }

  // Hard mode or Medium's "Smart" move
  const bestMove = minimax([...board], 'X');
  return bestMove.index ?? avail[0];
};
