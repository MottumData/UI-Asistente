import React, { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingIndicator from '../ChatInterface/loadingIndicator';

interface Step1Props {
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ onNext }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiURL = 'https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io';
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
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
        toast.success('Archivo subido correctamente');
        onNext();
      } else {
        toast.error('Error al subir el archivo');
      }
    } catch (error) {
      toast.error('Error al subir el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Seleccionar archivo</h3>
      <div className="flex items-center justify-center w-full mb-4">
        <label className="flex flex-col items-center w-full h-32 border-4 border-dashed border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-7">
            <svg className="w-8 h-8 text-gray-400 group-hover:text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M16.88 9.94a1.5 1.5 0 00-2.12 0L11 13.71V3.5a1.5 1.5 0 00-3 0v10.21l-3.76-3.77a1.5 1.5 0 00-2.12 2.12l6 6a1.5 1.5 0 002.12 0l6-6a1.5 1.5 0 000-2.12z" />
            </svg>
            <p className="text-sm text-gray-400 group-hover:text-gray-600 pt-1 tracking-wider">Selecciona un archivo</p>
          </div>
          <input type="file" className="opacity-0" onChange={handleFileChange} />
        </label>
      </div>
      {file && (
        <div className="text-sm text-gray-600 mb-4">
          <p>Archivo seleccionado: <span className="font-medium">{file.name}</span></p>
        </div>
      )}
      <button
        onClick={handleUpload}
        className={`w-full py-2 px-4 rounded-lg text-white ${file ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
        disabled={!file || isLoading}
      >
        {isLoading ? 'Subiendo...' : 'Subir'}
      </button>
      {isLoading && <LoadingIndicator isLoading={isLoading} />} {/* Mostrar el indicador de carga */}
    </div>
  );
};


export default Step1;