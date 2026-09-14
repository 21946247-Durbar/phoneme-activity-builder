'use client';

import { useState } from 'react';

export default function About() {
  const [videoVisible, setVideoVisible] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About This Project</h1>

      {/* Project Overview Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Project Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The <span className="font-semibold">Phoneme Activity Builder</span> is a web-based tool designed for 
          <span className="font-semibold"> Speech Pathology students and teachers</span> to create interactive 
          phoneme-based learning activities. This tool addresses the need for engaging, 
          technology-enhanced resources in phonetics education.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <span className="font-semibold">Assessment 1</span> focuses only on <span className="font-semibold">frontend design and usability</span>. 
          This version is <span className="font-semibold">client-side only</span>, with no server database. 
          All file exports are generated dynamically as <span className="font-semibold">standalone HTML files </span> 
          that run in any web browser, making them accessible for classroom use without internet access.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold"><b>Scope Confirmation:</b></span> This application generates standalone client-side files 
            (HTML/CSS/JS) with no server-side storage or database requirements. All functionality is 
            contained within the browser.
          </p>
        </div>
      </section>

      {/* Student Information Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Student Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-medium text-gray-900 dark:text-white">Sudipta Biswas Durbar</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Student ID</p>
            <p className="font-medium text-gray-900 dark:text-white">21946247</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>
            <p className="font-medium text-gray-900 dark:text-white">CSE3CWA - Cloud-based Web Application</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Assessment</p>
            <p className="font-medium text-gray-900 dark:text-white">Assessment 1: Frontend Design &amp; Usability</p>
          </div>
        </div>
      </section>

      {/* Activity Tools Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Activity Tools
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">🎯 Wordle Activity</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              A phoneme-based guessing game where students use <span className="font-medium">HCE phoneme symbols</span> 
              to solve target words. This activity supports:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>• <span className="font-medium">Phoneme recognition</span> through interactive guessing</li>
              <li>• <span className="font-medium">6 attempts</span> with color-coded feedback</li>
              <li>• <span className="font-medium">Interactive keyboard</span> with pronunciation hints</li>
              <li>• <span className="font-medium">Standalone HTML export</span> for offline use</li>
            </ul>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">🔍 Word Search Activity</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              A phoneme-based word search puzzle that helps students practice 
              <span className="font-medium"> phoneme recognition</span> and pattern matching.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>• <span className="font-medium">Configurable grid</span> dimensions (10-40)</li>
              <li>• <span className="font-medium">Interactive selection</span> with drag support</li>
              <li>• <span className="font-medium">Show/Hide solution</span> toggle for self-assessment</li>
              <li>• <span className="font-medium">Standalone HTML export</span> for offline use</li>
            </ul>
          </div>
        </div>
      </section>

      {/* GitHub Repository Section - ABOVE VIDEO */}
      <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          💻 GitHub Repository
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The complete source code for this project is available on GitHub. The repository includes 
          the full commit history, demonstrating professional version control practices.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/21946247-Durbar/phoneme-activity-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>View on GitHub</span>
          </a>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {/* Repository: phoneme-activity-builder */}
          </span>
        </div>
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            📌 <span className="font-medium">Video Walkthrough Note:</span> The video walkthrough will show the GitHub repository 
            homepage, demonstrating professional commit history and version control practices.
          </p>
        </div>
      </section>


{/* Video Walkthrough Section */}
<section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
    📹 Video Walkthrough
  </h2>
  <div className="space-y-4">
    <p className="text-sm text-gray-600 dark:text-gray-400">
      This video walkthrough demonstrates the key features and design decisions of the Phoneme Activity Builder.
      It covers the project scope, frontend architecture, usability considerations, and accessibility features.
    </p>
    
    {/* Google Drive Video Link Button */}
    <div className="flex flex-wrap gap-3">
      <a
        href="https://drive.google.com/file/d/1TQJDUdLiA1EEYazgI7Ktrv1wty857bdb/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.941.262 1.684 1.037 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/>
        </svg>
        Watch Video Walkthrough
      </a>
      
      <button
        onClick={() => setVideoVisible(!videoVisible)}
        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
        aria-expanded={videoVisible}
        aria-controls="video-container"
      >
        {videoVisible ? 'Hide Embedded Video' : 'Show Embedded Video'}
      </button>
    </div>
    
    {videoVisible && (
      <div id="video-container" className="space-y-3">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            controls
            className="w-full h-full"
            aria-label="Project walkthrough video"
          >
            <source src="project_demonstration_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">This video demonstrates:</p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1 list-disc list-inside">
            <li>Design decisions and component structure</li>
            <li>Usability and accessibility considerations</li>
            <li>How the interface supports Speech Pathology students and teachers</li>
            <li>Trade-offs made in the frontend design</li>
            <li>Demonstration of all features (Wordle, Word Search, HTML export)</li>
          </ul>
        </div>
      </div>
    )}
  </div>
</section>



      {/* References Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          📚 References
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          The following academic and industry sources informed the design and development of this project.
        </p>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <span className="font-medium">Cox, F.</span> (2012). <em>Australian English pronunciation and transcription</em>. 
            Cambridge University Press.
          </li>
          <li>
            <span className="font-medium">Harrington, J., &amp; Cox, F.</span> (2008). The acoustic characteristics of Australian English 
            vowels. <em>Journal of Phonetics</em>, 36(2), 328-344. https://doi.org/10.1016/j.wocn.2007.09.002
          </li>
          <li>
            <span className="font-medium">Moats, L.</span> (2020). <em>Speech to print: Language essentials for teachers</em> (3rd ed.). 
            Paul H. Brookes Publishing.
          </li>
          <li>
            <span className="font-medium">W3C Web Accessibility Initiative.</span> (2023). <em>Web Content Accessibility Guidelines 
            (WCAG) 2.1</em>. https://www.w3.org/TR/WCAG21/
          </li>
          <li>
            <span className="font-medium">React Documentation.</span> (2024). <em>React: The library for web and native user interfaces</em>.
            https://react.dev/
          </li>
          <li>
            <span className="font-medium">Tailwind CSS Documentation.</span> (2024). <em>Tailwind CSS: Utility-first CSS framework</em>.
            https://tailwindcss.com/
          </li>
        </ul>
      </section>
    </div>
  );
}