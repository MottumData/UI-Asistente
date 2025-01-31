import React, { createContext, ReactNode } from 'react';

{/* En este componente se define el contexto para cada paso del proceso de subida de TDR. */}

interface StepContextType {
  step: number;
  nextStep: () => void;
  goToStep: (step: number) => void;
  responseData: any;        // Added
  setResponseData: (data: any) => void;  // Added
}

export const StepContext = createContext<StepContextType | null>(null);

interface StepProviderProps {
  children: ReactNode;
  initialStep: number;
  onStepChange: (step: number) => void;
  responseData: any;        // Added
  setResponseData: (data: any) => void;  // Added
}

export const StepProvider: React.FC<StepProviderProps> = ({ 
  children, 
  initialStep, 
  onStepChange,
  responseData,      // Added
  setResponseData    // Added
}) => {
  const nextStep = () => onStepChange(initialStep + 1);
  const goToStep = (step: number) => onStepChange(step);

  const value = {
    step: initialStep,
    nextStep,
    goToStep,
    responseData,      // Added
    setResponseData    // Added
  };

  return (
    <StepContext.Provider value={value}>
      {children}
    </StepContext.Provider>
  );
};