"use client";

import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Step1 from '../UploadTdr/step1';
import Step2 from '../UploadTdr/step2';
import Step3 from '../UploadTdr/step3';
import Step4 from '../UploadTdr/step4';
import Step5 from '../UploadTdr/step5';
import Step6 from '../UploadTdr/step6';
import Step7 from '../UploadTdr/step7';
import SettingsButton from '../ChatInterface/settingsButton';
import { StepContext } from '../UploadTdr/stepContext'; 

{/* Esta página contiene los componentes de los pasos del formulario de carga de TDR. */}

const UploadTdrContainer = styled.div`
  flex: 1;
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: 20px;
  background-color: var(--card);
  color: var(--card-foreground);
  box-sizing: border-box;
  display: flex; /* Asegúrate de que el contenedor padre use flexbox */
  flex-direction: column; /* Asegúrate de que los hijos se apilen verticalmente */
`;

const UploadTdrPage: React.FC = () => {
  const stepContext = useContext(StepContext);
  
  if (!stepContext) {
    throw new Error('UploadTdrPage must be used within StepProvider');
  }

  const { 
    step, 
    nextStep, 
    goToStep,
    responseData,
    setResponseData 
  } = stepContext;

  return (
    <div className='ml-80 w-full'>
      <UploadTdrContainer>
      <SettingsButton/>
        {step === 0 && (
          <Step1 onNext={(data: any) => { setResponseData(data); nextStep(); }} />
        )}
        {step === 1 && responseData && (
          <Step2 responseData={responseData} onNext={nextStep} />
        )}
        {step === 2 && (
          <Step3
            responseData={responseData}
            setResponseData={setResponseData}
            onNext={nextStep}
            goToStep={goToStep}
          />
        )}
        {step === 3 && (
          <Step4
            responseData={responseData}
            setResponseData={setResponseData}
            onNext={nextStep}
            goToStep={goToStep}
          />
        )}
        {step === 4 && (
          <Step5 
           responseData={responseData}
           setResponseData={setResponseData}
           onNext={nextStep} 
           goToStep={goToStep} 
           
          />
        )}
        {step === 5 && (
          <Step6 
            responseData={responseData}
            setResponseData={setResponseData}
            onNext={nextStep}
            goToStep={goToStep}
          />
        )}
        {step === 6 && (
          <Step7 
            responseData={responseData}
            setResponseData={setResponseData}
            onNext={nextStep}
            goToStep={goToStep}
          />
        )}
      </UploadTdrContainer>
    </div>
  );
};

export default UploadTdrPage;