"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Step1 from '../UploadTdr/step1';
import UploadGuide from '../uploadGuide';

const UploadTdrPage = styled.div`
  flex: 1;
  padding: 20px;
  background-color: var(--card);
  color: var(--card-foreground);
  box-sizing: border-box;
`;

const UploadTdrInterface: React.FC = () => {
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <div className='ml-80'>
      <UploadTdrPage>
        {step === 1 && <Step1 onNext={handleNextStep} />}
      </UploadTdrPage>
    </div>
  );
};

export default UploadTdrInterface;