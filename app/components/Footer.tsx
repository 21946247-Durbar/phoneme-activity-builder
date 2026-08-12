'use client';

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span>© {currentYear} Phoneme Activity Builder</span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
            <span>Assessment 1: Frontend Design & Usability</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0">
            <span>Student: <b>Sudipta Biswas Durbar</b></span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
            <span>ID: <b>21946247</b></span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
            <span><b>CSE3CWA</b></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;