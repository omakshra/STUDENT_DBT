import React from 'react';
import { useTTS } from '../contexts/TTSContext';

const TTSToggle = () => {
  const { isEnabled, toggle, isPlaying } = useTTS();

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isEnabled
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title={isEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
    >
      <svg
        className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {isEnabled ? (
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        )}
      </svg>
      <span>{isEnabled ? 'TTS On' : 'TTS Off'}</span>
    </button>
  );
};

export default TTSToggle;