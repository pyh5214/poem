import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GeneratedResult {
  imageData: string;
  poem: string;
  poetStyle: string;
}

interface AppContextType {
  generatedResult: GeneratedResult | null;
  setGeneratedResult: (result: GeneratedResult | null) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        generatedResult,
        setGeneratedResult,
        capturedImage,
        setCapturedImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
