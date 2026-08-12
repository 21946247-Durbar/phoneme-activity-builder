export interface PhonemeWord {
  word: string;
  phonemes: string[];
  transcription: string;
}

export interface PhonemeGroup {
  id: string;
  label: string;
  phonemes: Phoneme[];
}

export interface Phoneme {
  symbol: string;
  example: string;
  group: 'plosive' | 'nasal' | 'fricative' | 'approximant' | 'monophthong' | 'diphthong';
  englishEquivalence: string;
}

export interface WordleGameState {
  targetWord: PhonemeWord;
  attempts: string[][];
  currentAttempt: number;
  currentPosition: number;
  gameOver: boolean;
  won: boolean;
}

export interface WordSearchGameState {
  words: PhonemeWord[];
  grid: string[][];
  foundWords: Set<string>;
  selectedCells: { row: number; col: number }[];
  solutions: { word: string; positions: { row: number; col: number }[] }[];
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface ExportSettings {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gameType: 'wordle' | 'wordsearch';
  wordCount: number;
  gridSize?: number;
}