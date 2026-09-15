'use client';

import { useState, useEffect } from 'react';
import { getSettings, setSettings } from '@/lib/cookies';
import { useTheme } from '@/lib/theme';

export default function Settings() {
  const { mode, setMode } = useTheme();
  const [settings, setLocalSettings] = useState<Record<string, any>>({
    difficulty: 'medium',
    maxAttempts: 6,
    showHints: true,
    animationSpeed: 'normal',
  });

  useEffect(() => {
    const savedSettings = getSettings();
    if (Object.keys(savedSettings).length > 0) {
      setLocalSettings(savedSettings);
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setLocalSettings(newSettings);
    setSettings(newSettings);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Appearance */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>
        <div>
          <label className="font-medium text-gray-700 dark:text-gray-300">Theme</label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Choose Light, Dark, or follow your system preference.
          </p>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setMode(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  mode === option
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                aria-pressed={mode === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Preferences</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="difficulty" className="font-medium text-gray-700 dark:text-gray-300">
                Default Difficulty
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The default difficulty level for new activities
              </p>
            </div>
            <select
              id="difficulty"
              value={settings.difficulty || 'medium'}
              onChange={(e) => handleSettingChange('difficulty', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="maxAttempts" className="font-medium text-gray-700 dark:text-gray-300">
                Wordle Max Attempts
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Number of guesses allowed in Wordle
              </p>
            </div>
            <input
              type="number"
              id="maxAttempts"
              value={settings.maxAttempts || 6}
              onChange={(e) => handleSettingChange('maxAttempts', parseInt(e.target.value) || 6)}
              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              min="3"
              max="10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="showHints" className="font-medium text-gray-700 dark:text-gray-300">
                Show Hints
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Display pronunciation hints on phoneme hover
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="showHints"
                checked={settings.showHints !== undefined ? settings.showHints : true}
                onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="animationSpeed" className="font-medium text-gray-700 dark:text-gray-300">
                Animation Speed
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Speed of animations and transitions
              </p>
            </div>
            <select
              id="animationSpeed"
              value={settings.animationSpeed || 'normal'}
              onChange={(e) => handleSettingChange('animationSpeed', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your preferences are saved using browser cookies and will persist across sessions.
          To clear your preferences, you can reset your browser cookies.
        </p>
        <button
          onClick={() => {
            const resetSettings = {
              difficulty: 'medium',
              maxAttempts: 6,
              showHints: true,
              animationSpeed: 'normal',
            };
            setLocalSettings(resetSettings);
            setSettings(resetSettings);
          }}
          className="mt-4 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
        >
          Reset Preferences to Defaults
        </button>
      </section>
    </div>
  );
}