
import React, { useEffect } from 'react';
import { Cell } from './Cell';
import { Button } from './Button';
import { GameState, Player, CellValue } from '../types';
import { audioService } from '../services/audioService';
import { getComputerMove } from '../services/aiService';
import { WIN_CONDITIONS } from '../constants';

interface GameScreenProps {
  state: GameState;
  onMove: (index: number) => void;
  onReset: () => void;
  onHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  state,
  onMove,
  onReset,
  onHome
}) => {
  const { board, currentPlayer, active, mode, difficulty, scores } = state;

  const checkWin = (board: CellValue[], player: Player) => {
    return WIN_CONDITIONS.some(combo => combo.every(idx => board[idx] === player));
  };

  const isDraw = board.every(c => c !== '') && !checkWin(board, 'O') && !checkWin(board, 'X');
  const winner = checkWin(board, 'O') ? 'O' : checkWin(board, 'X') ? 'X' : null;

  useEffect(() => {
    if (active && mode === 'pvc' && currentPlayer === 'X') {
      const timer = setTimeout(() => {
        const move = getComputerMove(board, difficulty);
        onMove(move);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [active, mode, currentPlayer, board, difficulty, onMove]);

  let statusText = `Player ${currentPlayer}'s Turn`;
  let statusColor = 'text-white';

  if (winner) {
    statusText = `Winner: Player ${winner}!`;
    statusColor = winner === 'O' ? 'text-[#00d4ff] neon-text-blue' : 'text-[#ff0055] neon-text-pink';
  } else if (isDraw) {
    statusText = "It's a Draw!";
    statusColor = 'text-gray-400';
  } else if (mode === 'pvc' && currentPlayer === 'X') {
    statusText = "AI is thinking...";
    statusColor = 'text-[#ff0055] animate-pulse';
  }

  // Determine if it's currently a human's turn to enable hover previews
  const isHumanTurn = active && !winner && !isDraw && (mode === 'pvp' || currentPlayer === 'O');

  return (
    <div className="flex flex-col items-center w-full max-w-md px-4 animate-fade-in">
      <div className="flex justify-between w-full mb-8">
        <div className={`
          flex-1 p-4 rounded-xl border transition-all duration-300
          ${currentPlayer === 'O' && active ? 'border-[#00d4ff] bg-[#00d4ff]/10 neon-border-blue' : 'border-gray-800 bg-black/30'}
        `}>
          <p className="text-[#00d4ff] text-xs font-bold uppercase mb-1">Player O</p>
          <p className="text-2xl font-syncopate">{scores.O}</p>
        </div>
        <div className="w-4" />
        <div className={`
          flex-1 p-4 rounded-xl border transition-all duration-300
          ${currentPlayer === 'X' && active ? 'border-[#ff0055] bg-[#ff0055]/10 neon-border-pink' : 'border-gray-800 bg-black/30'}
        `}>
          <p className="text-[#ff0055] text-xs font-bold uppercase mb-1">
            {mode === 'pvc' ? 'Computer' : 'Player X'}
          </p>
          <p className="text-2xl font-syncopate">{scores.X}</p>
        </div>
      </div>

      <p className={`text-2xl font-syncopate font-bold mb-6 text-center ${statusColor}`}>
        {statusText}
      </p>

      <div className="grid grid-cols-3 gap-3 w-full bg-[#1a0b3c]/50 p-3 rounded-2xl border border-[#261b4d] shadow-2xl mb-8">
        {board.map((val, idx) => (
          <Cell 
            key={idx} 
            index={idx} 
            value={val} 
            onClick={() => onMove(idx)}
            currentPlayer={currentPlayer}
            isGameActive={isHumanTurn}
          />
        ))}
      </div>

      <div className="flex gap-4 w-full">
        <Button variant="outline" className="flex-1" onClick={onHome}>
          MENU
        </Button>
        <Button variant="primary" className="flex-1" onClick={onReset}>
          REPLAY
        </Button>
      </div>
    </div>
  );
};
