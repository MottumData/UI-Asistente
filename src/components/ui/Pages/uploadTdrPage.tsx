"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Step1 from '../UploadTdr/step1';

const UploadTdrPage = styled.div`
  flex: 1;
  padding: 20px;
  background-color: var(--card);
  color: var(--card-foreground);
  box-sizing: border-box;
  display: flex; /* Asegúrate de que el contenedor padre use flexbox */
  flex-direction: column; /* Asegúrate de que los hijos se apilen verticalmente */
`;

const UploadTdrInterface: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <div className='ml-80 w-full'>
      <UploadTdrPage>
        {step === 1 && <Step1 onNext={handleNextStep} />}
      </UploadTdrPage>
    </div>
  );
};

export default UploadTdrInterface;