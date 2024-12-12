import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingIndicator from '../ChatInterface/loadingIndicator';
import {FaRegStickyNote, FaProjectDiagram, FaInfoCircle, FaRedo} from 'react-icons/fa';

interface Step3Props {
  responseData: any;
  setResponseData: any;
  onNext: () => void;
  goToStep: (stepNumber: number) => void;
}

const Step3: React.FC<Step3Props> = ({ responseData, setResponseData, onNext, goToStep }) => {
  const [isReloading, setIsReloading] = useState(false); 
  const [showCancelModal, setShowCancelModal] = useState(false);
  const summary = responseData['complete summary']; // Texto plano dinámico
  const keyPoints = responseData['key points']; // Objeto con datos clave
  const relatedProjects = responseData['related projects']; // Array de proyectos relacionados
  const apiURL = 'https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io';

  const handleReload = async () => {
    const payload = {
      query: keyPoints.resumen, // Puedes ajustar esto según sea necesario
      num_proposals: 5,
    };

    setIsReloading(true);

    try {
      const response = await fetch(`${apiURL}/related-projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(setResponseData);
        // Asumiendo que la respuesta tiene una estructura similar a 'related_projects'
        setResponseData((prevData: any) => ({
          ...prevData,
          'related projects': data['related_projects'],
        }));
        toast.success('Propuestas recargadas correctamente');
      } else {
        toast.error('Error al recargar las propuestas');
      }
    } catch (error) {
      toast.error('Error al recargar las propuestas');
    } finally {
      setIsReloading(false);
    }
  };

  const handleCancel = () => {
    // Lógica para cancelar la propuesta
    toast.info('Propuesta cancelada');
    setShowCancelModal(false);
    goToStep(0);
    // Puedes agregar navegación o restablecimiento de estado aquí
  };

  return (
    <div className="flex flex-col">
      {/* Encabezado de la Página */}
      <header className="w-full p-4 bg-white shadow-md mb-10 rounded-lg">
        {/* Etiqueta de Etapa */}
        <div className="mb-2 text-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
            Etapa de Propuesta
          </span>
        </div>
        {/* Título Principal */}
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Evaluación del proyecto
        </h1>
      </header>

      {/* Contenido Principal */}
      <div className="flex flex-col">

      <div className="flex items-start bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 text-center">
        <FaInfoCircle className="text-5xl mr-3 mt-0" />
        <p>
          En este paso se revisará la propuesta y se le presentará un resumen de esta, posteriormente, se le presentarán 5 propuestas relacionadas. Si las propuestas no están relacionadas como lo desearía, puede utilizar el botón de recarga para obtener nuevas propuestas relacionadas.
        </p>
      </div>

        {summary && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-4">
            <div className="flex items-start sm:col-span-2 mb-10">
              <FaRegStickyNote className="text-gray-500 flex-shrink-0 w-6 h-6 mr-4" />
              <div>
            <h3 className="text-lg font-medium text-gray-800">Resumen</h3>
            {/* Usemos en un futuro prose para mejorar la legibilidad y spacing del texto */}
            <div className="prose max-w-none text-gray-700 prose-li:my-0">
              <ReactMarkdown>{keyPoints.resumen}</ReactMarkdown>
            </div>
          </div>
        </div>
        {/* Botón para recargar propuestas */}
        <div className="flex justify-end">
          <button
            onClick={handleReload}
            className="
              w-6 h-6
              hover:text-gray-700
              active:opacity-75
              transition-opacity
              duration-200
              ease-in-out
              flex items-center justify-center
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            disabled={isReloading}
            aria-label="Recargar Propuestas"
            title="Recargar propuestas"
          >
            <FaRedo className="w-4 h-4" />
          </button>
        </div>

        {/* Indicador de Carga */}
        {isReloading && (
          <div className="my-4">
            <LoadingIndicator isLoading={isReloading} />
          </div>
        )}
        {relatedProjects && relatedProjects.length > 0 && (
          <div className="mt-6">
            <div className="flex items-start">
              <FaProjectDiagram className="text-gray-500 flex-shrink-0 w-6 h-6 mr-4" />
              <h3 className="text-lg font-medium text-gray-800">Proyectos Relacionados</h3>
            </div>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProjects.map((project: { [key: string]: string }, index: number) => {
                const [filename, description] = Object.entries(project)[0];
                return (
                  <li key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="text-md font-semibold text-blue-700 mb-2">{filename}</h4>
                    <p className="text-gray-600">
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
          </div>
        )}
        {/* Botón para avanzar al siguiente paso */}
        {/* Botones de Siguiente y Cancelar Propuesta */}
          <div className="flex justify-between mt-4 space-x-4">
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex-1 py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 transition duration-300"
            >
              Cancelar Propuesta
            </button>
            <button
              onClick={onNext}
              className="flex-1 py-2 px-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300"
            >
              Siguiente
            </button>
          </div>
        {/* Modal de Confirmación */}
        {showCancelModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
              <h2 className="text-xl font-semibold mb-4">Confirmar Cancelación</h2>
              <p className="mb-6">¿Está seguro de que desea cancelar la propuesta?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 transition duration-300"
                >
                  Sí
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="py-2 px-4 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3;
