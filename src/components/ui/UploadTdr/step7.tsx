import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingIndicator from '../ChatInterface/loadingIndicator';
import ReactMarkdown from 'react-markdown';

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
  const apiURL = process.env.API_BASE_URL || 'https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io';

  const makeProposal = async () => {
    setIsLoading(true);
    setIsSending(true);
    try {
      const payload = {
        proposal_id: responseData.proposal_id,
      };
      const response = await fetch(`${apiURL}/make-content/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        setProposalContent(data);
        console.log('proposalData:', data); // Imprime los datos recibidos
        await save_proposal(data.content); // Pasa 'data' como parámetro
        toast.success('Propuesta creada con éxito');
      } else {
        const errorData = await response.json();
        toast.error(`Error al crear la propuesta: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al crear la propuesta:', error);
      toast.error('Error al crear la propuesta');
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  const save_proposal = async (contentData: any) => {
    console.log('save_proposal ha sido llamado');
    console.log('proposalContent:', contentData);
    try {
      const payload = {
        proposal_id: responseData.proposal_id,
        content: contentData,
      };
      const response = await fetch(`${apiURL}/save-content/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        setResponseData((prevData: any) => ({
          ...prevData,
          ...data.data,
        }));
        toast.success('Propuesta guardada con éxito');
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al guardar la propuesta:', error);
      toast.error('Error al guardar la propuesta');
    }
  };

  const descargarPropuesta = async () => {
    try {
      const payload = {
        proposal_id: responseData.proposal_id,
      };
        const response = await fetch(`${apiURL}/download-proposal/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error en la descarga: ${response.statusText}`);
        }

        // Obtener el archivo como blob
        const blob = await response.blob();

        // Crear una URL para el archivo descargado
        const downloadUrl = window.URL.createObjectURL(blob);

        // Crear un enlace y hacer clic para iniciar la descarga
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${responseData.proposal_id}.docx`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Liberar memoria
        window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
        console.error('Error al descargar la propuesta:', error);
        alert('Error al descargar la propuesta.');
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
        <p>En este paso tendremos que generar el contenido de la propuesta. Una vez generado podremos descargarlo en formato .docx</p>
      </div>

      {/* Botón para actualizar los datos de Step 6 */}
      <div className="flex justify-between mt-4 space-x-4">
  <button
    onClick={() => goToStep(5)}
    className="flex-1 py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 transition duration-300"
  >
    Atrás
  </button>
  {!proposalContent ? (
    <button
      onClick={makeProposal}
      className={`flex-1 py-2 px-4 rounded-lg text-white transition duration-300 ${
        isSending ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
      }`}
      disabled={isSending}
    >
      {isSending ? 'Generando...' : 'Generar Contenido'}
    </button>
  ) : (
    <button
      onClick={descargarPropuesta} // Llama a la función que crearás
      className="flex-1 py-2 px-4 rounded-lg text-white bg-green-500 hover:bg-green-600 transition duration-300"
    >
      Descargar Propuesta
    </button>
    )}
  </div>

    {isLoading && <LoadingIndicator isLoading={isLoading} />}

    {proposalContent && (
    <div className="p-8 rounded-xl shadow-lg mt-8 bg-white border border-gray-100 transition-all duration-200 hover:shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
        Contenido Generado
      </h2>
      {Object.entries(proposalContent.content).map(([title, text]) => (
        <div key={title} className="mb-8 last:mb-0">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-l-4 border-blue-500 pl-4">
            {title}
          </h3>
          <div className="prose prose-lg max-w-none text-gray-600">
            <ReactMarkdown 
              components={{
                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
              }}
            >
              {text as string}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  )}
  </div>
  );
}

export default Step7;