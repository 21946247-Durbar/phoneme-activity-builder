import { PhonemeWord, WordleGameState } from '@/types';

export const createWordleGame = (targetWord: PhonemeWord): WordleGameState => {
  return {
    targetWord,
    attempts: [],
    currentAttempt: 0,
    currentPosition: 0,
    gameOver: false,
    won: false,
  };
};

export const evaluateGuess = (
  guess: string[],
  target: string[]
): { result: 'correct' | 'present' | 'absent'; position: number }[] => {
  const result: { result: 'correct' | 'present' | 'absent'; position: number }[] = [];
  const targetCopy = [...target];
  const guessCopy = [...guess];

  // First pass: mark correct positions
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result.push({ result: 'correct' as const, position: i });
      targetCopy[i] = '✓';
      guessCopy[i] = '✓';
    }
  }

  // Second pass: mark present positions
  for (let i = 0; i < guess.length; i++) {
    if (guessCopy[i] === '✓') continue;
    const foundIndex = targetCopy.indexOf(guess[i]);
    if (foundIndex !== -1) {
      result.push({ result: 'present' as const, position: i });
      targetCopy[foundIndex] = '✓';
    } else {
      result.push({ result: 'absent' as const, position: i });
    }
  }

  return result.sort((a, b) => a.position - b.position);
};

export const checkWordleWin = (state: WordleGameState): boolean => {
  if (state.attempts.length === 0) return false;
  const lastAttempt = state.attempts[state.attempts.length - 1];
  if (!lastAttempt) return false;
  return lastAttempt.join('') === state.targetWord.phonemes.join('');
};

export const updateWordleState = (
  state: WordleGameState,
  phoneme: string
): WordleGameState => {
  if (state.gameOver) return state;
  if (state.currentPosition >= state.targetWord.phonemes.length) return state;

  const newState = { ...state };
  if (!newState.attempts[newState.currentAttempt]) {
    newState.attempts[newState.currentAttempt] = [];
  }
  newState.attempts[newState.currentAttempt][newState.currentPosition] = phoneme;
  newState.currentPosition++;

  if (newState.currentPosition === newState.targetWord.phonemes.length) {
    const guess = newState.attempts[newState.currentAttempt];
    if (guess) {
      const results = evaluateGuess(guess, newState.targetWord.phonemes);
      const allCorrect = results.every(r => r.result === 'correct');

      if (allCorrect) {
        newState.won = true;
        newState.gameOver = true;
      } else if (newState.currentAttempt >= 5) {
        newState.gameOver = true;
      } else {
        newState.currentAttempt++;
        newState.currentPosition = 0;
      }
    }
  }

  return newState;
};

export const resetWordleGame = (targetWord: PhonemeWord): WordleGameState => {
  return createWordleGame(targetWord);
};