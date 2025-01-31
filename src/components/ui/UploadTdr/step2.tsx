import React from 'react';
import { FaClipboardList, FaBullseye, FaTasks, FaUsers, FaScroll, FaCalendarAlt, FaHourglassHalf, FaUserTie } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

{/* Paso 2 del proceso de subida de TDR. */}

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
      <div className="flex flex-col max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Datos Clave del Proyecto</h2>

        {keyPoints && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Título */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <dt className="flex items-center text-lg font-semibold text-gray-800 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                  <FaClipboardList className="text-blue-500 w-5 h-5 mr-3" />
                  Título
                </dt>
                <dd className="text-gray-700 leading-relaxed px-2">{keyPoints.titulo}</dd>
              </div>

              {/* Objetivo */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <dt className="flex items-center text-lg font-semibold text-gray-800 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                  <FaBullseye className="text-green-500 w-5 h-5 mr-3" />
                  Objetivo
                </dt>
                <dd className="text-gray-700 prose leading-relaxed px-2">
                  <ReactMarkdown>{keyPoints.objetivo}</ReactMarkdown>
                </dd>
              </div>

              {/* Actividades Principales */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <dt className="flex items-center text-lg font-semibold text-gray-800 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                  <FaTasks className="text-yellow-500 w-5 h-5 mr-3" />
                  Actividades Principales
                </dt>
                <dd className="text-gray-700 prose leading-relaxed px-2">
                  <ReactMarkdown>{formatMarkdownList(keyPoints.actividades_principales)}</ReactMarkdown>
                </dd>
              </div>

              {/* Personal Requerido */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <dt className="flex items-center text-lg font-semibold text-gray-800 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                  <FaUsers className="text-purple-500 w-5 h-5 mr-3" />
                  Personal Requerido
                </dt>
                <dd className="text-gray-700 prose leading-relaxed px-2">
                  <ReactMarkdown>{formatMarkdownList(keyPoints.personal_requerido)}</ReactMarkdown>
                </dd>
              </div>

              {/* Requerimientos */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <dt className="flex items-center text-lg font-semibold text-gray-800 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                  <FaScroll className="text-indigo-500 w-5 h-5 mr-3" />
                  Requerimientos
                </dt>
                <dd className="text-gray-700 prose leading-relaxed px-2">
                  <ReactMarkdown>{formatMarkdownList(keyPoints.requerimientos)}</ReactMarkdown>
                </dd>
              </div>

              {/* Fechas */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <dt className="flex items-center text-lg font-semibold text-gray-800 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                  <FaCalendarAlt className="text-red-500 w-5 h-5 mr-3" />
                  Fechas
                </dt>
                <dd className="text-gray-700 prose leading-relaxed px-2">
                  <ReactMarkdown>{formatFechasList(keyPoints.fechas)}</ReactMarkdown>
                </dd>
              </div>

              {/* Duración */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <dt className="flex items-center text-lg font-semibold text-gray-800 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                  <FaHourglassHalf className="text-pink-500 w-5 h-5 mr-3" />
                  Duración
                </dt>
                <dd className="text-gray-700 leading-relaxed px-2">{keyPoints.duracion}</dd>
              </div>

              {/* Cliente */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <dt className="flex items-center text-lg font-semibold text-gray-800 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                  <FaUserTie className="text-teal-500 w-5 h-5 mr-3" />
                  Cliente
                </dt>
                <dd className="text-gray-700 leading-relaxed px-2">{keyPoints.cliente}</dd>
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
