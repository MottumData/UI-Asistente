"use client";

import React from 'react';
import styled from 'styled-components';

const UploadTdrPage = styled.div`
  flex: 1;
  padding: 20px;
  background-color: var(--card);
  color: var(--card-foreground);
  box-sizing: border-box;
`;

const UploadTdrInterface: React.FC = () => {
  return (
    <UploadTdrPage>
      <h1>Ajustes</h1>
      {/* Añade aquí el contenido de ajustes */}
    </UploadTdrPage>
  );
};

export default UploadTdrInterface;