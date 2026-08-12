'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          🎵 Phoneme Activity Builder
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Create interactive <span className="font-semibold text-primary-600 dark:text-primary-400">phoneme-based</span> Wordle and Word Search activities for 
          <span className="font-semibold text-primary-600 dark:text-primary-400"> Speech Pathology</span> students and teachers.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/wordle"
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            🎯 Build Wordle Activity
          </Link>
          <Link
            href="/word-search"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            🔍 Build Word Search Activity
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            🎯 Wordle Activity
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create a <span className="font-medium">phoneme-based Wordle game</span> where students guess words using 
            <span className="font-medium"> HCE phoneme symbols</span> instead of standard spelling. Perfect for 
            practicing phoneme recognition in a fun, interactive way.
          </p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Select target words from HCE phoneme lists</li>
            <li>• Interactive preview with real-time feedback</li>
            <li>• Export as standalone HTML file</li>
            <li>• Phoneme keyboard with pronunciation hints</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            🔍 Word Search Activity
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Generate <span className="font-medium">phoneme-based word search puzzles</span> that help students practice 
            <span className="font-medium"> phoneme recognition</span> and pattern matching through interactive discovery.
          </p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Customizable grid dimensions</li>
            <li>• Select from HCE phoneme word lists</li>
            <li>• Interactive selection with drag support</li>
            <li>• Export as standalone HTML file</li>
          </ul>
        </div>
      </section>

      {/* About the Project Section */}
      <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          🎓 For Speech Pathology Educators
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This tool uses standard <span className="font-semibold">HCE (Harrington, Cox, and Evans)</span> broad phoneme symbols 
          for <span className="font-semibold">Australian English</span>. All activities are designed to support 
          <span className="font-semibold"> phoneme-based learning</span> and can be easily integrated into classroom 
          activities for Speech Pathology students.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            🗣️ HCE Phonemes
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            📚 Interactive Learning
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            🏫 Classroom Ready
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            📄 Standalone HTML Export
          </span>
        </div>
      </section>

      {/* GitHub Repository Link */}
      <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          💻 View the Source Code
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This project is open-source. Visit the GitHub repository to view the complete source code, 
          documentation, and commit history.
        </p>
        <a
          href="https://github.com/[YOUR_USERNAME]/phoneme-activity-builder"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span>View on GitHub</span>
        </a>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {/* Repository: phoneme-activity-builder */}
        </p>
      </section>
    </div>
  );
}