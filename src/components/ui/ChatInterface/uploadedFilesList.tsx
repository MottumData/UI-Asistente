// File: UploadedFilesList.tsx
import React from 'react';
import { File } from 'lucide-react';

interface UploadedFile {
  fileName: string;
  fileUrl: string;
}

interface UploadedFilesListProps {
  uploadedFiles: UploadedFile[];
}

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({ uploadedFiles }) => {
  return (
    <div className="mb-2">
      {uploadedFiles.map((file, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2 ml-10">
          <File className="text-gray-500" />
          <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
            {file.fileName}
          </a>
        </div>
      ))}
    </div>
  );
};

export default UploadedFilesList;