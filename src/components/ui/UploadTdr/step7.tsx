import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingIndicator from '../ChatInterface/loadingIndicator';

interface Step7Props {
  responseData: any;
  setResponseData: any;
  onNext: () => void;
  goToStep: (stepNumber: number) => void;
}

const Step7: React.FC<Step7Props> = ({ responseData, setResponseData, onNext, goToStep }) => {
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [proposalContent, setProposalContent] = useState<any>(null);

  const makeProposal = async () => {
      setIsLoading(true);
      setIsSending(true);
      try {
        const payload = {
          proposal_id: responseData.proposal_id,
        };
        const response = await fetch(`https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io/make-content/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
  
        if (response.ok) {
          const data = await response.json();
          setProposalContent(data);
          toast.success('Índice guardado correctamente');
        } else {
          const errorData = await response.json();
          toast.error(`Error al guardar el índice: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error al guardar el índice:', error);
        toast.error('Error al guardar el índice');
      } finally {
        setIsSending(false);
        setIsLoading(false);
      }
    };

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
      {!proposalContent && (
        <button
          onClick={makeProposal}
          className={`flex-1 py-2 px-4 rounded-lg text-white transition duration-300 ${
            isSending ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSending}
        >
          {isSending ? 'Generando...' : 'Generar Contenido'}
        </button>
      )}
    </div>

    {isLoading && <LoadingIndicator isLoading={isLoading} />}

    {proposalContent && (
      <div className="p-6 rounded-lg shadow-outer mt-6 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Contenido Generado</h2>
        {Object.entries(proposalContent.content).map(([title, text]) => (
          <div key={title} className="mb-4">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{text as string}</p>
          </div>
        ))}
      </div>
    )}
    </div>
  );
}

export default Step7;