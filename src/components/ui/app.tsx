'use client'

import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { StepProvider } from './UploadTdr/stepContext'; // Asegúrate de que la ruta sea correcta
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatPage from './Pages/chatPage';
import '../../app/globals.css';
import { useState, useEffect } from 'react';
import Head from 'next/head'

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [responseData, setResponseData] = useState<any>(null);

  const onStepChange = (newStep: number) => {
    setStep(newStep);
  };

  return (
    <StepProvider 
      initialStep={step} 
      onStepChange={onStepChange} 
      responseData={responseData} 
      setResponseData={setResponseData}
    >
    <>
      <div className="container mx-auto p-4 h-screen">

      <ChatPage />
      <ToastContainer />
    </div>
    </>
    </StepProvider>
  );
};

export default App;