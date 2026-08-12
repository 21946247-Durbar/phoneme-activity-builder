'use client';

import { PHONEME_GROUPS, getPhonemeColor } from '@/lib/phonemeData';
import { Phoneme } from '@/types';

interface PhonemeKeyboardProps {
  onPhonemeSelect: (phoneme: string) => void;
  usedPhonemes?: Record<string, 'correct' | 'present' | 'absent'>;
  disabled?: boolean;
}

const PhonemeKeyboard = ({
  onPhonemeSelect,
  usedPhonemes = {},
  disabled = false,
}: PhonemeKeyboardProps) => {
  const getPhonemeStatus = (symbol: string): string => {
    return usedPhonemes[symbol] || '';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'present':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'absent':
        return 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-50 cursor-not-allowed';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {PHONEME_GROUPS.map((group) => (
        <div key={group.id} className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {group.label}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.phonemes.map((phoneme: Phoneme) => {
              const status = getPhonemeStatus(phoneme.symbol);
              const isUsed = status === 'absent';
              const statusColor = getStatusColor(status);
              const baseColor = getPhonemeColor(phoneme.group);

              return (
                <button
                  key={phoneme.symbol}
                  onClick={() => !disabled && !isUsed && onPhonemeSelect(phoneme.symbol)}
                  disabled={disabled || isUsed}
                  className={`phoneme-key ${baseColor} ${statusColor} ${
                    disabled || isUsed ? 'cursor-not-allowed opacity-50' : ''
                  } transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-300`}
                  title={`${phoneme.symbol} — ${phoneme.englishEquivalence}`}
                  aria-label={`Phoneme ${phoneme.symbol}: ${phoneme.englishEquivalence}`}
                >
                  {phoneme.symbol}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhonemeKeyboard;