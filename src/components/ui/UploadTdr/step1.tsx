import React, { useState } from 'react';

interface Step1Props {
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ onNext }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload-tdr', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onNext();
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white border-gray-300">
      <h3 className="font-semibold text-gray-700">Seleccionar archivo</h3>
      <input type="file" onChange={handleFileChange} className="mt-2" />
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        disabled={!file}
      >
        Subir
      </button>
    </div>
  );
};

export default Step1;