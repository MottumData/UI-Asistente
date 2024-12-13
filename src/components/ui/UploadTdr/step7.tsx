import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';

interface Step7Props {
  responseData: any;
  setResponseData: any;
  onNext: () => void;
  goToStep: (stepNumber: number) => void;
}

const Step6: React.FC<Step7Props> = ({ responseData, setResponseData, onNext, goToStep }) => {
  const [isSending, setIsSending] = useState(false);

  return (
    <div className="flex flex-col">
      <header className="w-full p-4 bg-white shadow-md mb-10 rounded-lg">
        <div className="mb-2 text-center">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
            Etapa de Elaboración
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 text-center">Redacción de la Propuesta</h1>
      </header>

      <div className="flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-2 text-center">
        <FaInfoCircle className="text-xl mr-3" />
        <p>[Descripción informativa para el Step 7]</p>
      </div>

      {/* Botón para actualizar los datos de Step 6 */}
      <div className="flex justify-between mt-4 space-x-4">
        <button
          onClick={() => goToStep(5)}
          className="flex-1 py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 transition duration-300"
        >
          Atrás
        </button>
        <button
          onClick={async () => {
            {/*await handleUpdateConceptNotes();*/}
            onNext();
          }}
          className={`flex-1 py-2 px-4 rounded-lg text-white transition duration-300 ${
            isSending ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSending}
        >
          {isSending ? 'Enviando...' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default Step6;