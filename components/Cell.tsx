
import React from 'react';
import { CellValue, Player } from '../types';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  index: number;
  currentPlayer?: Player;
  isGameActive?: boolean;
}

export const Cell: React.FC<CellProps> = ({ value, onClick, currentPlayer, isGameActive }) => {
  const isInteractable = isGameActive && !value;

  return (
    <div 
      onClick={onClick}
      className={`
        relative w-full aspect-square bg-white/5 rounded-xl border transition-all duration-300
        flex items-center justify-center group overflow-hidden
        ${value ? 'cursor-default border-[#261b4d]' : 'cursor-pointer border-[#261b4d]'}
        ${isInteractable ? 'hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]' : ''}
        active:scale-95
      `}
    >
      {/* Ghost Mark Preview */}
      {isInteractable && currentPlayer && (
        <span className={`
          absolute text-5xl md:text-6xl font-syncopate select-none transition-opacity duration-300 opacity-0 group-hover:opacity-10
          ${currentPlayer === 'O' ? 'text-[#00d4ff]' : 'text-[#ff0055]'}
        `}>
          {currentPlayer}
        </span>
      )}

      {/* Actual Mark */}
      <span className={`
        text-5xl md:text-6xl font-syncopate select-none transition-all duration-500
        ${value ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        ${value === 'O' ? 'text-[#00d4ff] neon-text-blue' : 'text-[#ff0055] neon-text-pink'}
      `}>
        {value}
      </span>

      {/* Subtle overlay glow */}
      {isInteractable && (
        <div className={`
          absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-10
          ${currentPlayer === 'O' ? 'bg-[#00d4ff]' : 'bg-[#ff0055]'}
        `} />
      )}
    </div>
  );
};
