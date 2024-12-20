import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingIndicator from '../ChatInterface/loadingIndicator';
import { v4 as uuidv4 } from 'uuid';

interface Step6Props {
  responseData: any;
  setResponseData: any;
  onNext: () => void;
  goToStep: (stepNumber: number) => void;
}

interface Section {
  id: string;
  titulo: string;
  contenido: string;
  subSecciones?: Section[];
}

const Step6: React.FC<Step6Props> = ({ responseData, setResponseData, onNext, goToStep }) => {
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchMakeIndex = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io/make-index/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ proposal_id: responseData.proposal_id }),
        });

        if (response.ok) {
          const data = await response.json();
          const transformedSections = transformDataToSections(data);
          setSections(transformedSections);
          toast.success('Estructura de la propuesta cargada correctamente');
        } else {
          const errorData = await response.json();
          toast.error(`Hubo un fallo cargando la estructura: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Hubo un fallo cargando la estructura:', error);
        toast.error('Hubo un fallo cargando la estructura');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMakeIndex();
  }, [responseData.proposal_id]);

  const transformDataToSections = (data: any): Section[] => {

    const traverse = (obj: any): Section[] => {
      return Object.keys(obj).map((key) => {
        const valor = obj[key];
        return {
          id: uuidv4(),
          titulo: key,
          contenido: typeof valor === 'string' ? valor : '',
          subSecciones: typeof valor === 'object' && valor !== null ? traverse(valor) : undefined,
        };
      });
    };

    return traverse(data);
  };

  const handleChange = (id: string, field: keyof Section, value: string) => {
    const updateSections = (secs: Section[]): Section[] => {
      return secs.map((sec) => {
        if (sec.id === id) {
          return { ...sec, [field]: value };
        }
        if (sec.subSecciones) {
          return { ...sec, subSecciones: updateSections(sec.subSecciones) };
        }
        return sec;
      });
    };
    setSections(updateSections(sections));
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: uuidv4(),
        titulo: `Nueva Sección ${sections.length + 1}`,
        contenido: '',
      },
    ]);
  };

  const removeSection = (id: string) => {
    const deleteSection = (secs: Section[]): Section[] => {
      return secs.filter((sec) => sec.id !== id).map((sec) => ({
        ...sec,
        subSecciones: sec.subSecciones ? deleteSection(sec.subSecciones) : undefined,
      }));
    };
    setSections(deleteSection(sections));
  };

  const renderSections = (secs: Section[]) => {
    return secs.map((sec) => (
      <div key={sec.id} className="mb-4 p-4 border rounded-lg bg-gray-100">
        <div className="flex justify-between items-center mb-2">
          <input
            type="text"
            value={sec.titulo}
            onChange={(e) => handleChange(sec.id, 'titulo', e.target.value)}
            className="flex-1 mr-2 p-2 border rounded"
            placeholder="Título de la sección"
          />
          <FaTrash
            className="text-red-500 cursor-pointer"
            onClick={() => removeSection(sec.id)}
            title="Remove Section"
          />
        </div>
        <textarea
          value={sec.contenido}
          onChange={(e) => handleChange(sec.id, 'contenido', e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Contenido de la sección"
        />
        {sec.subSecciones && sec.subSecciones.length > 0 && (
          <div className="pl-4 mt-2">
            {renderSections(sec.subSecciones)}
          </div>
        )}
        <button
          onClick={() => addSubSection(sec.id)}
          className="flex items-center mt-2 text-blue-500 hover:text-blue-700"
        >
          <FaPlus className="mr-2" /> Añadir Sub-Sección
        </button>
      </div>
    ));
  };

  const addSubSection = (parentId: string) => {
    const updateSections = (secs: Section[]): Section[] => {
      return secs.map((sec) => {
        if (sec.id === parentId) {
          const newSubSection: Section = {
            id: uuidv4(),
            titulo: `Nueva Sub-Sección ${sec.subSecciones ? sec.subSecciones.length + 1 : 1}`,
            contenido: '',
          };
          return {
            ...sec,
            subSecciones: sec.subSecciones ? [...sec.subSecciones, newSubSection] : [newSubSection],
          };
        }
        if (sec.subSecciones) {
          return { ...sec, subSecciones: updateSections(sec.subSecciones) };
        }
        return sec;
      });
    };
    setSections(updateSections(sections));
  };

  const handleSave = async () => {
    setIsSending(true);
    try {
      const payload = {
        proposal_id: responseData.proposal_id,
        index: transformSectionsToData(sections),
      };
      const response = await fetch(`https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io/save-index/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Índice guardado correctamente');
        onNext();
      } else {
        const errorData = await response.json();
        toast.error(`Error al guardar el índice: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al guardar el índice:', error);
      toast.error('Error al guardar el índice');
    } finally {
      setIsSending(false);
    }
  };

  const transformSectionsToData = (secs: Section[]): any => {
    const data: any = {};

    secs.forEach((sec) => {
      if (sec.subSecciones && sec.subSecciones.length > 0) {
        data[sec.titulo] = transformSectionsToData(sec.subSecciones);
      } else {
        data[sec.titulo] = sec.contenido;
      }
    });

    return data;
  };

  return (
    <div className="flex flex-col">
      <header className="w-full p-4 bg-white shadow-md mb-10 rounded-lg">
        <div className="mb-2 text-center">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
            Etapa de Elaboración
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 text-center">Estructura de la Propuesta</h1>
      </header>

      <div className="flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-2 text-center">
        <FaInfoCircle className="text-xl mr-3" />
        <p>Edita la estructura del índice de la propuesta. Puedes modificar títulos, descripciones y añadir nuevas secciones según sea necesario.</p>
      </div>

      {isLoading && <LoadingIndicator isLoading={isLoading} />}

      {/* Contenedor Principal de Secciones */}
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-6">
      {sections.map((sec) => (
        <div key={sec.id} className="mb-6 last:mb-0">
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 
                        p-6 transition-all duration-200 hover:shadow-md">
            {/* Input del Título */}
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={sec.titulo}
                onChange={(e) => handleChange(sec.id, 'titulo', e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                        transition-all duration-200 bg-white"
                placeholder="Título de la sección"
              />
              <button
                onClick={() => removeSection(sec.id)}
                className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200 
                         hover:bg-red-50 rounded-lg"
                title="Eliminar sección"
              >
                <FaTrash size={18} />
              </button>
            </div>

            {/* Área de Contenido */}
            <textarea
              value={sec.contenido}
              onChange={(e) => handleChange(sec.id, 'contenido', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                       transition-all duration-200 min-h-[100px] resize-y mb-4 bg-white"
              placeholder="Contenido de la sección"
            />

            {/* Subsecciones */}
            {sec.subSecciones && sec.subSecciones.length > 0 && (
              <div className="pl-6 mt-4 border-l-2 border-blue-200">
                {renderSections(sec.subSecciones)}
              </div>
            )}

            {/* Botón de Añadir Subsección */}
            <button
              onClick={() => addSubSection(sec.id)}
              className="inline-flex items-center px-4 py-2 text-sm text-blue-600 
                       hover:text-blue-700 bg-blue-50 hover:bg-blue-100 
                       rounded-lg transition-all duration-200"
            >
              <FaPlus className="mr-2" /> Añadir Sub-Sección
            </button>
          </div>
        </div>
      ))}

      {/* Botón de Añadir Sección Principal */}
      <button
        onClick={addSection}
        className="mt-6 inline-flex items-center px-6 py-3 text-blue-600 
                 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg 
                 transition-all duration-200 font-medium w-full justify-center"
      >
        <FaPlus className="mr-2" /> Añadir Nueva Sección
      </button>
    </div>

      <div className="flex justify-between mt-4 space-x-4">
        <button
          onClick={() => goToStep(4)}
          className="flex-1 py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 transition duration-300"
        >
          Atrás
        </button>
        <button
          onClick={handleSave}
          className={`flex-1 py-2 px-4 rounded-lg text-white transition duration-300 ${
            isSending ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSending}
        >
          {isSending ? 'Enviando...' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default Step6;