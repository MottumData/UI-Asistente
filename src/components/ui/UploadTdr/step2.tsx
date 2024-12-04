import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaClipboardList, FaBullseye, FaTasks, FaUsers, FaScroll, FaCalendarAlt, FaHourglassHalf, FaUserTie, FaRegStickyNote } from 'react-icons/fa';

interface Step2Props {
    responseData: any;
    onNext: () => void;
}

const Step2: React.FC<Step2Props> = ({ responseData, onNext }) => {
  const keyPoints = responseData['key points'];
  const summary = responseData['complete summary'];

  return (
    <div className="flex flex-col">
      {/* Header de la Página */}
      <header className="w-full p-4 bg-white shadow-md mb-10 rounded-lg">
        {/* Título de la Etapa */}
        <div className="mb-2 text-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
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
        <h2 className="text-2xl font-bold mb-4">Datos Clave del Proyecto:</h2>

        {/* Mostrar los puntos clave */}
        {keyPoints && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Título */}
              <div className="flex items-start">
                <FaClipboardList className="text-blue-500 flex-shrink-0 w-6 h-6 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Título</h3>
                  <p className="text-gray-600">{keyPoints.titulo}</p>
                </div>
              </div>

              {/* Objetivo */}
              <div className="flex items-start">
                <FaBullseye className="text-green-500 flex-shrink-0 w-6 h-6 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Objetivo</h3>
                  <p className="text-gray-600">{keyPoints.objetivo}</p>
                </div>
              </div>

              {/* Actividades Principales */}
              <div className="flex items-start">
                <FaTasks className="text-yellow-500 flex-shrink-0 w-6 h-6 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Actividades Principales</h3>
                  <p className="text-gray-600">{keyPoints.actividades_principales}</p>
                </div>
              </div>

              {/* Personal Requerido */}
              <div className="flex items-start">
                <FaUsers className="text-purple-500 flex-shrink-0 w-6 h-6 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Personal Requerido</h3>
                  <p className="text-gray-600">{keyPoints.personal_requerido}</p>
                </div>
              </div>

              {/* Requerimientos */}
              <div className="flex items-start">
                <FaScroll className="text-indigo-500 flex-shrink-0 w-6 h-6 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Requerimientos</h3>
                  <p className="text-gray-600">{keyPoints.requerimientos}</p>
                </div>
              </div>

              {/* Fechas */}
              <div className="flex items-start">
                <FaCalendarAlt className="text-red-500 flex-shrink-0 w-6 h-6 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Fechas</h3>
                  <p className="text-gray-600">{keyPoints.fechas}</p>
                </div>
              </div>

              {/* Duración */}
              <div className="flex items-start">
                <FaHourglassHalf className="text-pink-500 flex-shrink-0 w-6 h-6 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Duración</h3>
                  <p className="text-gray-600">{keyPoints.duracion}</p>
                </div>
              </div>

              {/* Cliente */}
              <div className="flex items-start">
                <FaUserTie className="text-teal-500 flex-shrink-0 w-6 h-6 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Cliente</h3>
                  <p className="text-gray-600">{keyPoints.cliente}</p>
                </div>
              </div>

              {/* Resumen */}
              <div className="flex items-start sm:col-span-2">
                <FaRegStickyNote className="text-gray-500 flex-shrink-0 w-6 h-6 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Resumen</h3>
                  <p className="text-gray-600 whitespace-pre-line">{keyPoints.resumen}</p>
                </div>
              </div>
            </div>
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