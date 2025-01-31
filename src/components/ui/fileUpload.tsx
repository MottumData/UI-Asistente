// File: FileUpload.tsx
import React from 'react';
import { Paperclip } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

{/* Componente para subida de archivos. */}

interface FileUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  return (
    <>
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="p-2 mt-6">
          <Paperclip 
            className="
              focus:outline-none
              w-6 h-6
              hover:text-gray-700
              active:opacity-75
              transition-opacity
              duration-200
              ease-in-out
            "
            data-tooltip-id="tooltip"
            data-tooltip-content="Subir archivo"
          />
        </div>
        <Tooltip id="tooltip" place="top"/>
      </label>
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </>
  );
};

export default FileUpload;