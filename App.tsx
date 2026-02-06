
import React, { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { GameState, Player, CellValue, GameMode, Difficulty, AudioSettings } from './types';
import { audioService } from './services/audioService';
import { WIN_CONDITIONS, INITIAL_BOARD } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'game'>('home');
  const [state, setState] = useState<GameState>({
    board: INITIAL_BOARD,
    active: false,
    currentPlayer: 'O',
    mode: 'pvc',
    difficulty: 'hard',
    scores: { O: 0, X: 0 },
    audioSettings: {
      sfxEnabled: true,
      musicEnabled: false
    }
  });

  // Sync audio service with state
  useEffect(() => {
    audioService.setSfxEnabled(state.audioSettings.sfxEnabled);
    audioService.setMusicEnabled(state.audioSettings.musicEnabled);
  }, [state.audioSettings]);

  const checkWin = (board: CellValue[], player: Player) => {
    return WIN_CONDITIONS.some(combo => combo.every(idx => board[idx] === player));
  };

  const handleSetMode = (mode: GameMode) => setState(prev => ({ ...prev, mode }));
  const handleSetDifficulty = (difficulty: Difficulty) => setState(prev => ({ ...prev, difficulty }));

  const handleToggleSfx = () => setState(prev => ({
    ...prev,
    audioSettings: { ...prev.audioSettings, sfxEnabled: !prev.audioSettings.sfxEnabled }
  }));

  const handleToggleMusic = () => setState(prev => ({
    ...prev,
    audioSettings: { ...prev.audioSettings, musicEnabled: !prev.audioSettings.musicEnabled }
  }));

  const startGame = () => {
    audioService.play('start');
    setState(prev => ({
      ...prev,
      board: Array(9).fill(''),
      active: true,
      currentPlayer: 'O',
      scores: { O: 0, X: 0 }
    }));
    setView('game');
  };

  const resetBoard = () => {
    audioService.play('start');
    setState(prev => ({
      ...prev,
      board: Array(9).fill(''),
      active: true,
      currentPlayer: 'O'
    }));
  };

  const goHome = () => {
    audioService.play('transition');
    setView('home');
  };

  const handleMove = useCallback((index: number) => {
    setState(prev => {
      if (prev.board[index] !== '' || !prev.active) return prev;

      audioService.play('click');
      const newBoard = [...prev.board];
      newBoard[index] = prev.currentPlayer;

      const playerWon = checkWin(newBoard, prev.currentPlayer);
      const isDraw = !playerWon && newBoard.every(c => c !== '');

      if (playerWon) {
        audioService.play('win');
        return {
          ...prev,
          board: newBoard,
          active: false,
          scores: {
            ...prev.scores,
            [prev.currentPlayer]: prev.scores[prev.currentPlayer] + 1
          }
        };
      }

      if (isDraw) {
        audioService.play('draw');
        return {
          ...prev,
          board: newBoard,
          active: false
        };
      }

      return {
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === 'O' ? 'X' : 'O'
      };
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {view === 'home' ? (
        <HomeScreen 
          mode={state.mode}
          difficulty={state.difficulty}
          audioSettings={state.audioSettings}
          onSetMode={handleSetMode}
          onSetDifficulty={handleSetDifficulty}
          onToggleSfx={handleToggleSfx}
          onToggleMusic={handleToggleMusic}
          onStart={startGame}
        />
      ) : (
        <GameScreen 
          state={state}
          onMove={handleMove}
          onReset={resetBoard}
          onHome={goHome}
        />
      )}
      
      <footer className="mt-12 opacity-30 text-xs tracking-widest uppercase">
        Designed for Excellence • &copy; 2025
      </footer>
    </div>
  );
};

export default App;
