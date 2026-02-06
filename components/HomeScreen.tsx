
import React, { useState } from 'react';
import { Button } from './Button';
import { GameMode, Difficulty, AudioSettings } from '../types';

interface HomeScreenProps {
  mode: GameMode;
  difficulty: Difficulty;
  audioSettings: AudioSettings;
  onSetMode: (m: GameMode) => void;
  onSetDifficulty: (d: Difficulty) => void;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
  onStart: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  mode,
  difficulty,
  audioSettings,
  onSetMode,
  onSetDifficulty,
  onToggleSfx,
  onToggleMusic,
  onStart
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex flex-col items-center w-full max-w-sm px-6 animate-fade-in relative">
      {/* Quick Music Toggle */}
      {!showSettings && (
        <button 
          onClick={onToggleMusic}
          className={`
            absolute -top-12 right-6 p-3 rounded-full border transition-all duration-300
            ${audioSettings.musicEnabled 
              ? 'border-[#00d4ff] bg-[#00d4ff]/20 text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.4)]' 
              : 'border-white/10 bg-white/5 text-white/40'}
          `}
          title={audioSettings.musicEnabled ? "Disable Music" : "Enable Music"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </button>
      )}

      <h1 className="text-4xl md:text-6xl font-syncopate font-bold text-center mb-12 tracking-tighter">
        <span className="text-[#00d4ff] neon-text-blue block">NEON</span>
        <span className="text-[#ff0055] neon-text-pink block mt-[-0.5rem]">TIC TAC</span>
        <span className="text-white text-xl md:text-2xl mt-2 block opacity-80">ULTIMATE PRO</span>
      </h1>

      <div className="w-full space-y-8">
        {!showSettings ? (
          <>
            <div className="space-y-4">
              <label className="text-gray-400 text-sm font-semibold uppercase tracking-widest text-center block">Game Mode</label>
              <div className="flex gap-4">
                <Button 
                  variant="choice" 
                  selected={mode === 'pvc'} 
                  onClick={() => onSetMode('pvc')}
                >
                  vs Computer
                </Button>
                <Button 
                  variant="choice" 
                  selected={mode === 'pvp'} 
                  onClick={() => onSetMode('pvp')}
                >
                  2 Players
                </Button>
              </div>
            </div>

            {mode === 'pvc' && (
              <div className="space-y-4 animate-fade-in">
                <label className="text-gray-400 text-sm font-semibold uppercase tracking-widest text-center block">AI Difficulty</label>
                <div className="flex gap-2">
                  <Button 
                    variant="choice" 
                    selected={difficulty === 'easy'} 
                    onClick={() => onSetDifficulty('easy')}
                    className="!px-2"
                  >
                    Easy
                  </Button>
                  <Button 
                    variant="choice" 
                    selected={difficulty === 'medium'} 
                    onClick={() => onSetDifficulty('medium')}
                    className="!px-2"
                  >
                    Medium
                  </Button>
                  <Button 
                    variant="choice" 
                    selected={difficulty === 'hard'} 
                    onClick={() => onSetDifficulty('hard')}
                    className="!px-2"
                  >
                    Hard
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-8 flex flex-col gap-4">
              <Button onClick={onStart} className="w-full text-xl py-4" silent>
                START MATCH 🎮
              </Button>
              <Button variant="outline" onClick={() => setShowSettings(true)} className="text-sm py-2 opacity-70">
                SETTINGS ⚙️
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-fade-in bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-syncopate text-center text-white/80">Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Sound Effects</span>
                <Button 
                  variant="choice" 
                  selected={audioSettings.sfxEnabled} 
                  onClick={onToggleSfx}
                  className="!flex-none px-6"
                >
                  {audioSettings.sfxEnabled ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Background Music</span>
                <Button 
                  variant="choice" 
                  selected={audioSettings.musicEnabled} 
                  onClick={onToggleMusic}
                  className="!flex-none px-6"
                >
                  {audioSettings.musicEnabled ? 'ON' : 'OFF'}
                </Button>
              </div>
            </div>

            <Button variant="primary" onClick={() => setShowSettings(false)} className="w-full mt-4">
              BACK TO MENU
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
