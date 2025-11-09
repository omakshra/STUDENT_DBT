import React, { createContext, useContext, useState, useEffect } from 'react';

const TTSContext = createContext();

export const useTTS = () => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};

export const TTSProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [voice, setVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      const voices = speechSynthesis.getVoices();
      // Prefer Indian English voice if available
      const indianVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('India') || voice.name.includes('Indian'))
      );
      setVoice(indianVoice || voices[0]);
    }
  }, []);

  const speak = (text) => {
    if (!isEnabled || !('speechSynthesis' in window)) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentText('');
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentText('');
    };

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentText('');
  };

  const toggle = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled) {
      stop();
    }
  };

  const value = {
    isEnabled,
    isPlaying,
    currentText,
    voice,
    rate,
    pitch,
    volume,
    setIsEnabled,
    setIsPlaying,
    setVoice,
    setRate,
    setPitch,
    setVolume,
    speak,
    stop,
    toggle
  };

  return (
    <TTSContext.Provider value={value}>
      {children}
    </TTSContext.Provider>
  );
};