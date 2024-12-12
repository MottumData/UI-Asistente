import React, { createContext, useState, ReactNode } from 'react';

interface StepContextProps {
  step: number;
  nextStep: () => void;
  goToStep: (stepNumber: number) => void;
}

export const StepContext = createContext<StepContextProps>({
  step: 0,
  nextStep: () => {},
  goToStep: () => {},
});

interface StepProviderProps {
  children: ReactNode;
}

export const StepProvider: React.FC<StepProviderProps> = ({ children }) => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((prev) => prev + 1);
  const goToStep = (stepNumber: number) => setStep(stepNumber);

  return (
    <StepContext.Provider value={{ step, nextStep, goToStep }}>
      {children}
    </StepContext.Provider>
  );
};