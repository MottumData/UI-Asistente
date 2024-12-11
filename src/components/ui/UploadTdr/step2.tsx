import React from 'react';
import { FaClipboardList, FaBullseye, FaTasks, FaUsers, FaScroll, FaCalendarAlt, FaHourglassHalf, FaUserTie } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

interface Step2Props {
    responseData: any;
    onNext: () => void;
}

const formatMarkdownList = (content: string) => {
  return content.replace(/(\d)\)/g, '\n$1.');
};

const formatFechasList = (content: string) => {
  return content
    .split('. ')
    .map(item => `- ${item}`)
    .join('\n');
};

const Step2: React.FC<Step2Props> = ({ responseData, onNext }) => {
  const keyPoints = responseData['key points'];

  return (
    <div className="flex flex-col">
      {/* Header de la Página */}
      <header className="w-full p-4 bg-white shadow-md mb-10 rounded-lg">
        {/* Título de la Etapa */}
        <div className="mb-2 text-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide text-justify">
            Etapa de Evaluación
          </span>
        </div>
        {/* Título Principal */}
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Análisis y Evaluación del Proyecto
        </h1>
      </header>

      {/* Contenido Principal */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-justify">Datos Clave del Proyecto:</h2>

        {keyPoints && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-4">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              
              {/* Título */}
              <div>
                <dt className="flex items-center text-lg font-medium text-gray-800 mb-1">
                  <FaClipboardList className="text-blue-500 w-6 h-6 mr-2" />
                  Título
                </dt>
                <dd className="text-gray-600 text-justify">{keyPoints.titulo}</dd>
              </div>

              {/* Objetivo */}
              <div>
                <dt className="flex items-center text-lg font-medium text-gray-800 mb-1">
                  <FaBullseye className="text-green-500 w-6 h-6 mr-2" />
                  Objetivo
                </dt>
                <dd className="text-gray-600 prose text-justify">
                  <ReactMarkdown>{keyPoints.objetivo}</ReactMarkdown>
                </dd>
              </div>

              {/* Actividades Principales */}
              <div>
                <dt className="flex items-center text-lg font-medium text-gray-800 mb-1">
                  <FaTasks className="text-yellow-500 w-6 h-6 mr-2" />
                  Actividades Principales
                </dt>
                <dd className="text-gray-600 prose text-justify">
                <ReactMarkdown>{formatMarkdownList(keyPoints.actividades_principales)}</ReactMarkdown>
                </dd>
              </div>

              {/* Personal Requerido */}
              <div>
                <dt className="flex items-center text-lg font-medium text-gray-800 mb-1">
                  <FaUsers className="text-purple-500 w-6 h-6 mr-2" />
                  Personal Requerido
                </dt>
                <dd className="text-gray-600 prose text-justify">
                  <ReactMarkdown>{formatMarkdownList(keyPoints.personal_requerido)}</ReactMarkdown>
                </dd>
              </div>

              {/* Requerimientos */}
              <div>
                <dt className="flex items-center text-lg font-medium text-gray-800 mb-1">
                  <FaScroll className="text-indigo-500 w-6 h-6 mr-2" />
                  Requerimientos
                </dt>
                <dd className="text-gray-600 prose text-justify">
                  <ReactMarkdown>{formatMarkdownList(keyPoints.requerimientos)}</ReactMarkdown>
                </dd>
              </div>

              {/* Fechas */}
              <div>
              <dt className="flex items-center text-lg font-medium text-gray-800 mb-1">
                <FaCalendarAlt className="text-red-500 w-6 h-6 mr-2" />
                Fechas
              </dt>
              <dd className="text-gray-600 prose text-justify">
                <ReactMarkdown>{formatFechasList(keyPoints.fechas)}</ReactMarkdown>
              </dd>
            </div>

              {/* Duración */}
              <div>
                <dt className="flex items-center text-lg font-medium text-gray-800 mb-1">
                  <FaHourglassHalf className="text-pink-500 w-6 h-6 mr-2" />
                  Duración
                </dt>
                <dd className="text-gray-600 text-justify">{keyPoints.duracion}</dd>
              </div>

              {/* Cliente */}
              <div>
                <dt className="flex items-center text-lg font-medium text-gray-800 mb-1">
                  <FaUserTie className="text-teal-500 w-6 h-6 mr-2" />
                  Cliente
                </dt>
                <dd className="text-gray-600 text-justify">{keyPoints.cliente}</dd>
              </div>
              
            </dl>
          </div>
        )}

        {/* Botón para avanzar al siguiente paso */}
        <button
          onClick={onNext}
          className="mt-4 w-full py-2 px-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step2;
