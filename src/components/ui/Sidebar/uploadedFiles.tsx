// UploadedFiles.tsx
import React, { useState, useEffect } from 'react';
import { FileText, FileJson2, Sheet, FileType2, Trash } from 'lucide-react'; // Replace with actual icon library
import { toast } from 'react-toastify';

interface UploadedFile {
  fileName: string;
  fileUrl: string;
  fileType: string;
}

const apiURL = process.env.API_BASE_URL || 'https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io'; // Replace with actual API URL

const UploadedFiles: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      fetchUploadedFiles();
      toast.success('Archivos obtenidos exitosamente');
    }
  };

  const fetchUploadedFiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiURL}/list-documents/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add other headers if necessary, e.g., authentication
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los archivos subidos');
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);
      setUploadedFiles(
        data.documents.map((fileName: string) => ({
          fileName,
          fileUrl: `${apiURL}/documents/${fileName}`,
          fileType: getFileType(fileName),
        }))
      );
    } catch (err: any) {
      console.error('Error al obtener los archivos subidos:', err);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop();
    switch (extension) {
      case 'txt':
        return 'text/plain';
      case 'json':
        return 'application/json';
      case 'xls':
      case 'xlsx':
        return 'application/vnd.ms-excel';
      case 'csv':
        return 'text/csv';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'text/plain';
    }
  };

  const getFileIcon = (fileType: string) => {
    const iconSizeClass = 'w-6 h-6 text-gray-700';
    switch (fileType) {
      case 'text/plain':
        return <FileText className={iconSizeClass} />;
      case 'application/json':
        return <FileJson2 className={iconSizeClass} />;
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <Sheet className={iconSizeClass} />;
      case 'text/csv':
        return <FileType2 className={iconSizeClass} />;
      case 'application/pdf':
        return <FileText className={iconSizeClass} />;
      default:
        return <FileText className={iconSizeClass} />;
    }
  };

  const deleteFile = async (fileName: string) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar "${fileName}"?`);
    if (!confirmDelete) return;
  
    try {
      const requestBody = JSON.stringify({ "filename": fileName });
      console.log('Request body:', requestBody);

      const response = await fetch(`${apiURL}/delete-document/?filename=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add other headers if necessary, e.g., authentication
          // 'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        // Attempt to parse error message from response
        let errorMessage = 'Error al eliminar el archivo';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON, keep the default error message
        }
        throw new Error(errorMessage);
      }
  
      // Optionally, handle response data if available
      let data;
      try {
        data = await response.json();
        console.log('Archivo eliminado:', data);
      } catch (e) {
        console.log('Archivo eliminado sin contenido adicional en la respuesta.');
      }
  
      // Remove the deleted file from the state
      setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.fileName !== fileName));
      toast.success(`Archivo "${fileName}" eliminado exitosamente`);
    } catch (err: any) {
      console.error('Error al eliminar el archivo:', err);
      toast.error(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  return (
    <div className="mt-4 relative">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-2 bg-gray-300 hover:bg-gray-100 rounded-lg transition"
      >
        <span className="font-semibold">Archivos Subidos</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? 'transform rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="p-2 absolute bottom-full mb-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Cargando archivos...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">Error: {error}</div>
          ) : uploadedFiles.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No hay archivos subidos.</div>
          ) : (
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-100">
                  <div className="flex items-center flex-grow">
                    {getFileIcon(file.fileType)}
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-500 hover:underline truncate"
                      style={{ flex: 1 }} // Use flex to ensure the link takes up available space
                    >
                      {file.fileName}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteFile(file.fileName)}
                    className="ml-4 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    title="Eliminar archivo"
                    aria-label={`Eliminar ${file.fileName}`}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadedFiles;