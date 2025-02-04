import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import LoadingIndicator from '../ChatInterface/loadingIndicator';

{/* Paso 5 del proceso de subida de TDR. */}

interface Step5Props {
  responseData: any;
  setResponseData: any;
  onNext: () => void;
  goToStep: (stepNumber: number) => void;
}

const Step5: React.FC<Step5Props> = ({ responseData, setResponseData, onNext, goToStep }) => {
  const [sections, setSections] = useState<Array<{ key: string; content: string }>>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';



  useEffect(() => {
    const initializeSections = () => {
      const conceptNotes = responseData['concept_notes'];
      const newSections = Object.keys(conceptNotes).map((key) => ({
        key: key,
        content: conceptNotes[key],
      }));
      setSections(newSections);
    };

    initializeSections();
  }, [responseData]);

  const handleContentChange = (key: string, newContent: string) => {
    const updatedSections = sections.map((section) =>
      section.key === key ? { ...section, content: newContent } : section
    );
    setSections(updatedSections);
  
    const updatedConceptNotes = updatedSections.reduce((acc, section) => {
      acc[section.key] = section.content;
      return acc;
    }, {} as Record<string, string>);
  
    setResponseData({ ...responseData, concept_notes: updatedConceptNotes });
  };

  const formatKey = (key: string) => {
    const withSpaces = key.replace(/_/g, ' ');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
  };

  const make_index = async (proposal_id: string) => {
    try {
      const response = await fetch(`${apiURL}/make-index/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposal_id }),
      });
  
      if (response.ok) {
        toast.success('El índice se ha creado correctamente');
      } else {
        const errorData = await response.json();
        toast.error(`Hubó un error creando el índice: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Hubó un error creando el índice:', error);
      toast.error('Hubó un error creando el índice');
    }
  };

  const handleUpdateConceptNotes = async () => {
    const payload = {
      proposal_id: responseData.proposal_id,
      concept_notes: responseData.concept_notes, // Sending the updated concept_notes
    };
    setIsSending(true);
    setIsLoading(true);
  
    try {
      const response = await fetch(`${apiURL}/save-concept-note/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        setResponseData((prevData: any) => ({
          ...prevData,
          ...data.data,
        }));
        toast.success('Notas conceptuales actualizadas correctamente');
        await make_index(responseData.proposal_id); 
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al actualizar las notas conceptuales:', error);
      toast.error('Error al actualizar las notas conceptuales');
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <header className="w-full p-4 bg-white shadow-md mb-10 rounded-lg">
        <div className="mb-2 text-center">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
            Etapa de Elaboración
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 text-center">Nota Conceptual</h1>
      </header>

      <div className="flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-2 text-center">
        <FaInfoCircle className="text-xl mr-3" />
        <p>Edite o redacte la nota conceptual sobre la que se va a escribir la propuesta.</p>
      </div>

      <div className="p-6 rounded-lg shadow-outer mb-4">
        {/* Added flex container for icon and heading */}
        <div className="flex items-center justify-center mb-8">
          <FaEdit className="text-lg mr-2 text-blue-700" /> {/* Edit Icon */}
          <h3 className="text-lg font-medium text-gray-800">Editar Nota Conceptual</h3>
        </div>

        <div className="grid gap-8">
          {sections.map((section) => (
            <div key={section.key} className="bg-gray-50 p-6 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md">
              <h4 className="text-lg font-semibold mb-3 text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {formatKey(section.key)}
              </h4>
              <TextareaAutosize
                className="w-full p-4 rounded-lg bg-white border border-gray-300 
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                          transition-all duration-200 text-gray-700 min-h-[100px]
                          shadow-inner"
                value={section.content}
                onChange={(e) => handleContentChange(section.key, e.target.value)}
                placeholder={`Ingrese el contenido para ${formatKey(section.key)}...`}
              />
            </div>
          ))}
        </div>
      </div>
      
      {isLoading && <LoadingIndicator isLoading={isLoading} />}
      <div className="flex justify-between mt-4 space-x-4">
        <button
          onClick={() => goToStep(3)}
          className="flex-1 py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 transition duration-300"
        >
          Atrás
        </button>
        <button
          onClick={async () => {
            await handleUpdateConceptNotes();
            onNext();
          }}
          className={`flex-1 py-2 px-4 rounded-lg text-white transition duration-300 ${
            isSending ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSending}
        >
          {isSending ? 'Enviando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default Step5;