import React, { createContext, useContext, useState } from "react";

const VolumeContext = createContext();

export const VolumeProvider = ({ children }) => {
  const [volume, setVolume] = useState(100);

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {children}
    </VolumeContext.Provider>
  );
};

export const useVolume = () => {
  return useContext(VolumeContext);
};
