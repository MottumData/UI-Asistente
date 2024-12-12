'use client'

import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { StepProvider } from './UploadTdr/stepContext'; // Asegúrate de que la ruta sea correcta
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatPage from './Pages/chatPage';
import '../../app/globals.css';

const App: React.FC = () => {
  return (
    <StepProvider>
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