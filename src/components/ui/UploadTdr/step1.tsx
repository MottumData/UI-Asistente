import React, { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingIndicator from '../ChatInterface/loadingIndicator';
import { AlertTriangle } from 'lucide-react';

{/* Paso 1 del proceso de subida de TDR. */}

interface Step1Props {
  onNext: (responseData: any) => void;
}

const Step1: React.FC<Step1Props> = ({ onNext }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setIsUploadSuccessful(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);

    try {
      const response = await fetch(`${apiURL}/upload-tdr/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResponseData(data);
        toast.success('Archivo subido correctamente');
        setIsUploadSuccessful(true);
      } else {
        toast.error('Error al subir el archivo');
        setIsUploadSuccessful(false);
      }
    } catch (error) {
      toast.error('Error al subir el archivo');
      setIsUploadSuccessful(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
          Subir Fichero con los Términos de Referencia
        </h1>
      </header>

      <div className="flex-grow">
        <div
          className="flex items-center justify-center p-4 mb-4 text-sm text-yellow-800 bg-yellow-50 rounded-lg"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-800" />
          <span>
            <span className="font-medium">Atención:</span> Una vez avance al siguiente paso, no le será posible volver atrás.
          </span>
        </div>

        {/* Contenedor Principal */}
        <div className="items-center justify-center p-4">
          <div className="w-full p-4 bg-white rounded-lg shadow-md">
            {/* Texto de Instrucción */}
            <p className="mb-4 text-center text-gray-700">
              Por favor, para comenzar con el proceso, suba unos términos de referencia.
            </p>

            {/* Sección de Selección de Archivo */}
            <div className="flex items-center justify-center w-full mb-4">
              <label className="flex flex-col items-center w-full h-32 border-4 border-dashed border-gray-300 hover:border-blue-400 rounded-lg cursor-pointer transition duration-300">
                <div className="flex flex-col items-center justify-center pt-7">
                  <svg
                    className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition duration-300"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.88 9.94a1.5 1.5 0 00-2.12 0L11 13.71V3.5a1.5 1.5 0 00-3 0v10.21l-3.76-3.77a1.5 1.5 0 00-2.12 2.12l6 6a1.5 1.5 0 002.12 0l6-6a1.5 1.5 0 000-2.12z" />
                  </svg>
                  <p className="text-sm text-gray-400 group-hover:text-blue-600 pt-1 tracking-wider transition duration-300">
                    Selecciona un archivo
                  </p>
                </div>
                <input type="file" className="opacity-0 w-full h-full" onChange={handleFileChange} />
              </label>
            </div>

            {/* Mostrar nombre del archivo seleccionado */}
            {file && (
              <div className="text-sm text-gray-600 mb-4">
                <p>
                  Archivo seleccionado: <span className="font-medium">{file.name}</span>
                </p>
              </div>
            )}

            {/* Botón de Subida */}
            <button
              onClick={handleUpload}
              className={`w-full py-2 px-4 rounded-lg text-white transition duration-300 ${
                file
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!file || isLoading}
            >
              {isLoading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
        </div>
      </div>

      {/* Botón de Siguiente */}
      <div className="p-4">
        <button
          onClick={() => onNext(responseData)}
          className={`w-full py-2 px-4 rounded-lg text-white transition duration-300 ${
            isUploadSuccessful
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!isUploadSuccessful}
        >
          Siguiente
        </button>
        {isLoading && <LoadingIndicator isLoading={isLoading} />}
      </div>
    </div>
  );
};


export default Step1;