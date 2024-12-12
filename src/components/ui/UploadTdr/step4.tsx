import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Step4Props {
  responseData: any;
  setResponseData: any;
  onNext: () => void;
  goToStep: (stepNumber: number) => void;
}

const Step4: React.FC<Step4Props> = ({ responseData, setResponseData, onNext, goToStep }) => {
  const proposal_id = responseData['proposal_id'];
  const tdr_summary = responseData['complete summary'];
  const relatedProjects = responseData['related projects'];
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleCheckboxChange = (filename: string) => {
    if (selectedProjects.includes(filename)) {
      setSelectedProjects(selectedProjects.filter(item => item !== filename));
    } else {
      setSelectedProjects([...selectedProjects, filename]);
    }
  };

  const handleUseProjects = async () => {
    const apiURL = 'https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io'; // Reemplaza con tu URL real
    const payload = {
        proposal_id: proposal_id, // Incluir el proposal_id
        tdr_summary: tdr_summary, // Asegúrate de que este campo esté disponible en responseData
        information_sources: selectedProjects,
      };
    setIsSending(true);

    try {
      const response = await fetch(`${apiURL}/make-concept-notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseData((prevData: any) => ({
          ...prevData,
          ...data,
        }));
        toast.success('Proyectos enviados correctamente');
      } else {
        toast.error('Error al enviar los proyectos seleccionados');
      }
    } catch (error) {
      toast.error('Error al enviar los proyectos seleccionados');
    } finally {
      setIsSending(false);
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
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Fuentes de Información
        </h1>
      </header>

      <div className="flex items-center bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
        <FaInfoCircle className="text-xl mr-3" />
        <p>
          Seleccione los proyectos relacionados que desea utilizar para elaborar la propuesta.
        </p>
      </div>

      {relatedProjects && relatedProjects.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Proyectos Relacionados</h3>
          <form>
            {relatedProjects.map((project: { [key: string]: string }, index: number) => {
              const [filename, description] = Object.entries(project)[0];
              return (
                <div key={index} className="mb-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 mr-2"
                      checked={selectedProjects.includes(filename)}
                      onChange={() => handleCheckboxChange(filename)}
                    />
                    <div>
                      <h4 className="text-md font-semibold text-blue-700 mb-1">{filename}</h4>
                      <p className="text-gray-600">{description}</p>
                    </div>
                  </label>
                </div>
              );
            })}
          </form>
        </div>
      )}
        <div className="flex justify-between mt-4 space-x-4">
        <button
            onClick={goToStep.bind(null, 2)}
            className="flex-1 py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 transition duration-300"
        >
            Atrás
        </button>
        <button
            onClick={async () => {
            await handleUseProjects();
            onNext();
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-white transition duration-300 ${
            isSending || selectedProjects.length === 0
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isSending || selectedProjects.length === 0}
        >
            {isSending ? 'Enviando...' : 'Usar estos proyectos'}
        </button>
        </div>
    </div>
  );
};

export default Step4;