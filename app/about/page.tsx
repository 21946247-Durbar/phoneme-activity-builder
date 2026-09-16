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
          The <span className="font-semibold">Phoneme Activity Builder</span> is a full-stack web application
          for <span className="font-semibold">Speech Pathology students and teachers</span> to create interactive
          phoneme-based Wordle and Word Search activities using HCE (Harrington, Cox, Evans) phoneme symbols
          for Australian English.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <span className="font-semibold">Assessment 1</span> established the frontend design and usability.
          <span className="font-semibold"> Assessment 2</span> extends that work with a{' '}
          <span className="font-semibold">Prisma + SQLite backend</span>,{' '}
          <span className="font-semibold">RESTful CRUD APIs</span>,{' '}
          <span className="font-semibold">Zod validation</span>, a{' '}
          <span className="font-semibold">health check endpoint</span>, and{' '}
          <span className="font-semibold">Docker containerisation</span>.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Scope:</span> The application stores word lists and activity
            settings in a SQLite database, exposes them via Next.js API routes, and generates{' '}
            <span className="font-semibold">standalone HTML files</span> from stored data. The whole app
            runs inside a <span className="font-semibold">Docker container</span> with baked-in seed data.
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
            <p className="font-medium text-gray-900 dark:text-white">Assessment 2: Backend Implementation &amp; Database Integration</p>
          </div>
        </div>
      </section>

      {/* What A2 Adds Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          What Assessment 2 Adds
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">🗄️ Database &amp; ORM</h3>
            <ul className="text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>• <span className="font-medium">Prisma 6 + SQLite</span> — 6-model schema</li>
              <li>• Multi-character phoneme support (tʃ, iː, æɪ)</li>
              <li>• Cascading deletes &amp; indexed relations</li>
              <li>• Migration + idempotent seed script</li>
            </ul>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">🔌 Backend APIs</h3>
            <ul className="text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>• RESTful CRUD for word lists, words, activities</li>
              <li>• <span className="font-medium">Zod validation</span> on every write</li>
              <li>• Consistent JSON errors (400 / 404 / 409 / 500)</li>
              <li>• <span className="font-medium">/api/health</span> returns 200 OK</li>
            </ul>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">🖥️ Frontend Integration</h3>
            <ul className="text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>• Wordle &amp; Word Search fetch words from the DB</li>
              <li>• New <span className="font-medium">/word-lists</span> CRUD manager</li>
              <li>• Teachers can add <span className="font-medium">arbitrary</span> phoneme words</li>
              <li>• Standalone HTML export uses DB data</li>
            </ul>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">🐳 Docker</h3>
            <ul className="text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>• Multi-stage build (deps → builder → runner)</li>
              <li>• Baked-in migrations + seed (reproducible)</li>
              <li>• Non-root user, healthcheck, IPv4 binding</li>
              <li>• One <span className="font-medium">docker build</span> + <span className="font-medium">docker run</span></li>
            </ul>
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
              A phoneme-based guessing game where students use <span className="font-medium">HCE phoneme symbols</span> to solve target words.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>• Words fetched from the <span className="font-medium">database</span></li>
              <li>• Difficulty-dependent attempts (8 / 6 / 4)</li>
              <li>• Interactive keyboard with pronunciation hints</li>
              <li>• <span className="font-medium">Standalone HTML export</span> for offline use</li>
            </ul>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">🔍 Word Search Activity</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              A phoneme-based word search puzzle that helps students practice <span className="font-medium">phoneme recognition</span> and pattern matching.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>• Words fetched from the <span className="font-medium">database</span></li>
              <li>• Configurable grid + random selection</li>
              <li>• Mouse drag <span className="font-medium">and keyboard</span> word selection</li>
              <li>• <span className="font-medium">Standalone HTML export</span> for offline use</li>
            </ul>
          </div>
        </div>
      </section>

      {/* GitHub Repository Section */}
      <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          💻 GitHub Repository
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The complete source code is on GitHub, with a full commit history demonstrating professional
          version control practices, including a feature branch and logical, descriptive commits.
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
        </div>
      </section>

      {/* Video Walkthrough Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          📹 Video Walkthrough
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The video walkthrough demonstrates the backend, database, CRUD operations, Docker container,
            and frontend-backend integration for Assessment 2.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://drive.google.com/file/d/1xHfqnRZCsITkruY_xMKWY1IoLjf2oyPv/view?usp=sharing"
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
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">The video demonstrates:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1 list-disc list-inside">
                  <li>GitHub repository homepage and commit history</li>
                  <li>Prisma schema walkthrough (multi-character phonemes)</li>
                  <li>Live CRUD demonstration on word lists and words</li>
                  <li><code className="font-mono">/api/health</code> returning 200 OK</li>
                  <li>Docker build &amp; running container</li>
                  <li>Generating Wordle and Word Search HTML from database data</li>
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
            vowels. <em>Journal of Phonetics</em>, 36(2), 328–344. https://doi.org/10.1016/j.wocn.2007.09.002
          </li>
          <li>
            <span className="font-medium">Moats, L.</span> (2020). <em>Speech to print: Language essentials for teachers</em> (3rd ed.).
            Paul H. Brookes Publishing.
          </li>
          <li>
            <span className="font-medium">Prisma.</span> (2024). <em>Prisma ORM documentation</em>.
            https://www.prisma.io/docs
          </li>
          <li>
            <span className="font-medium">Docker.</span> (2024). <em>Docker documentation</em>.
            https://docs.docker.com/
          </li>
          <li>
            <span className="font-medium">Zod.</span> (2024). <em>Zod: TypeScript-first schema validation</em>.
            https://zod.dev/
          </li>
          <li>
            <span className="font-medium">W3C Web Accessibility Initiative.</span> (2023). <em>Web Content Accessibility Guidelines (WCAG) 2.1</em>.
            https://www.w3.org/TR/WCAG21/
          </li>
        </ul>
      </section>
    </div>
  );
}