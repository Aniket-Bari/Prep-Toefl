import React, { createContext, useState } from 'react';

export const AudioContext = createContext();

export const AudioContextProvider = ({ children }) => {
  const [audioStopped, setAudioStopped] = useState(false);

  return (
    <AudioContext.Provider value={{ audioStopped, setAudioStopped }}>
      {children}
    </AudioContext.Provider>
  );
};
