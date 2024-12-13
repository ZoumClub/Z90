import React from 'react';
import { Github } from 'lucide-react';

export function GitHubButton() {
  return (
    <button 
      className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      onClick={() => window.open('https://github.com/ZoumClub', '_blank')}
    >
      <Github className="w-5 h-5" />
      View on GitHub
    </button>
  );
}