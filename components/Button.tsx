
import React from 'react';
import { audioService } from '../services/audioService';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'choice';
  selected?: boolean;
  className?: string;
  silent?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  selected = false,
  className = '',
  silent = false
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-bold transition-all duration-300 active:scale-95 outline-none focus:ring-2 focus:ring-[#00d4ff]/50";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#00d4ff] to-[#ff0055] text-white shadow-lg hover:shadow-[0_0_20px_rgba(255,0,85,0.5)]",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    outline: "border-2 border-white/20 text-white hover:border-white/50 bg-transparent",
    choice: `border-2 flex-1 text-sm md:text-base ${
      selected 
        ? "border-[#00d4ff] text-white bg-[#00d4ff]/20 shadow-[0_0_15px_rgba(0,212,255,0.4)]" 
        : "border-gray-700 text-gray-500 bg-transparent"
    }`
  };

  const handleClick = () => {
    if (!silent) {
      audioService.play('ui_click');
    }
    onClick();
  };

  return (
    <button 
      onClick={handleClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
