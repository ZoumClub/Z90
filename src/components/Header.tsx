import React from 'react';

export function Header() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Welcome to ZoumClub
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Your platform for connecting and sharing experiences
      </p>
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        onClick={() => window.open('https://github.com/ZoumClub', '_blank')}
      >
        Get Started
      </button>
    </div>
  );
}