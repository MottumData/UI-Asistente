import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { unified } from 'unified';
import remarkParse from 'remark-parse';

interface Step5Props {
  responseData: any;
  setResponseData: any;
  onNext: () => void;
  goToStep: (stepNumber: number) => void;
}

const Step5: React.FC<Step5Props> = ({ responseData, setResponseData, onNext, goToStep }) => {
  const [sections, setSections] = useState<Array<{ heading: string; content: string }>>([]);

  useEffect(() => {
    const parseMarkdown = () => {
      const tree: any = unified().use(remarkParse).parse(responseData['concept_notes']);
      const newSections: Array<{ heading: string; content: string }> = [];
      let currentHeading = '';

      tree.children.forEach((node: any) => {
        if (node.type === 'paragraph') {
          // Verificar si el párrafo completo está en negrita
          const isFullBold = node.children.every(
            (child: any) => child.type === 'strong' || child.type === 'text'
          ) && node.children.some((child: any) => child.type === 'strong');

          if (isFullBold) {
            // Extraer el texto del encabezado
            const headingText = node.children
              .map((child: any) => child.value)
              .join('')
              .replace(/\*\*/g, '')
              .trim();

            currentHeading = headingText;
            newSections.push({ heading: currentHeading, content: '' });
          } else {
            // Extraer el contenido del párrafo
            const contentText = node.children
              .map((child: any) => (child.value ? child.value : ''))
              .join('')
              .trim();

            if (currentHeading) {
              const lastSection = newSections[newSections.length - 1];
              lastSection.content += contentText + '\n\n';
            } else {
              // Si no hay un encabezado actual, agregar una sección sin encabezado
              newSections.push({ heading: 'Información General', content: contentText + '\n\n' });
              currentHeading = 'Información General';
            }
          }
        } else if (node.type === 'list') {
          // Manejar listas dentro de la sección actual
          const listItems = node.children
            .map((item: any) => {
              const itemContent = item.children.map((child: any) => {
                if (child.type === 'paragraph') {
                  return child.children
                    .map((grandChild: any) => (grandChild.value ? grandChild.value : ''))
                    .join('');
                }
                return '';
              }).join('');
              return `- ${itemContent.trim()}`;
            })
            .join('\n');

          if (currentHeading) {
            const lastSection = newSections[newSections.length - 1];
            lastSection.content += listItems + '\n\n';
          } else {
            newSections.push({ heading: 'Información General', content: listItems + '\n\n' });
            currentHeading = 'Información General';
          }
        }
      });

      setSections(newSections);
    };

    parseMarkdown();
  }, [responseData]);

  const handleContentChange = (index: number, newContent: string) => {
    const updatedSections = [...sections];
    updatedSections[index].content = newContent;
    setSections(updatedSections);

    const updatedMarkdown = updatedSections
      .map((section) =>
        section.heading
          ? `**${section.heading}**\n\n${section.content.trim()}`
          : `${section.content.trim()}`
      )
      .join('\n\n');
    setResponseData({ ...responseData, concept_notes: updatedMarkdown });
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

      <div className="flex items-center bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 text-center">
        <FaInfoCircle className="text-xl mr-3" />
        <p>Edite o redacte la nota conceptual sobre la que se va a escribir la propuesta.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-4 overflow-y-auto max-h-96">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Editar Nota Conceptual</h3>
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            {section.heading && (
              <h4 className="text-md font-semibold text-blue-700 mb-2">{section.heading}</h4>
            )}
            <textarea
              className="w-full p-2 border border-gray-300 rounded resize-none"
              rows={5}
              value={section.content}
              onChange={(e) => handleContentChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4 space-x-4">
        <button
          onClick={() => goToStep(3)}
          className="flex-1 py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 transition duration-300"
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-2 px-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step5;