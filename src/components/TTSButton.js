import React from 'react';
import { useTTS } from '../contexts/TTSContext';

const TTSButton = ({ text, className = '', children }) => {
  const { isEnabled, speak, isPlaying, currentText } = useTTS();

  const handleClick = () => {
    if (isEnabled && text) {
      speak(text);
    }
  };

  const isCurrentlyPlaying = isEnabled && isPlaying && currentText === text;

  return (
    <button
      onClick={handleClick}
      disabled={!isEnabled || !text}
      className={`flex items-center gap-2 ${className} ${
        isCurrentlyPlaying ? 'animate-pulse' : ''
      }`}
      title={isEnabled ? 'Click to hear text' : 'Enable TTS to hear text'}
    >
      {children}
      {isEnabled && text && (
        <svg
          className={`w-4 h-4 ${isCurrentlyPlaying ? 'text-blue-600' : 'text-gray-400'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

export default TTSButton;