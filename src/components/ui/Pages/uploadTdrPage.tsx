"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Step1 from '../UploadTdr/step1';
import Step2 from '../UploadTdr/step2';
import Step3 from '../UploadTdr/step3';

interface UploadTdrPageProps {
  step: number;
  nextStep: () => void;
}

const UploadTdrContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: var(--card);
  color: var(--card-foreground);
  box-sizing: border-box;
  display: flex; /* Asegúrate de que el contenedor padre use flexbox */
  flex-direction: column; /* Asegúrate de que los hijos se apilen verticalmente */
`;

const UploadTdrPage: React.FC<UploadTdrPageProps> =  ({ step, nextStep }) => {
  const [responseData, setResponseData] = useState(null);

  return (
    <div className='ml-80 w-full'>
      <UploadTdrContainer>
      {step === 0 && <Step1 onNext={(data) => { setResponseData(data); nextStep(); }} />}
      {step === 1 && responseData && <Step2 responseData={responseData} onNext={nextStep} />}
      {step === 2 && <Step3 responseData={responseData} setResponseData={setResponseData} onNext={nextStep} />}

      </UploadTdrContainer>
    </div>
  );
};

export default UploadTdrPage;