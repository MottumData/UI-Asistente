import React from 'react';
import { Card, CardContent } from './card';

interface UploadGuideProps {
  step: number;
}

const steps = [
  { title: 'Seleccionar archivo', content: 'Haz clic en "Seleccionar archivo" para elegir el documento que deseas subir.' },
  { title: 'Verificar documento', content: 'Asegúrate de que el documento esté en el formato correcto y no exceda el tamaño máximo permitido.' },
  { title: 'Agregar metadatos', content: 'Añade información relevante como título, descripción y palabras clave.' },
  { title: 'Confirmar y subir', content: 'Revisa toda la información y haz clic en "Subir" para finalizar el proceso.' },
  { title: 'Revisión final', content: 'Verifica que todos los datos sean correctos antes de finalizar.' },
  { title: 'Proceso completado', content: 'Tu documento ha sido subido exitosamente.' },
];

  const UploadGuide: React.FC<UploadGuideProps> = ({ step }) => {

    return (
      <div className="space-y-4">
        {steps.map((s, index) => (
          <Card
            key={index}
            className={`p-4 border rounded-lg ${index === step ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}`}
          >
            <CardContent>
              <h3 className={`font-semibold ${index === step ? 'text-blue-500' : 'text-gray-700'}`}>{s.title}</h3>
              <p className="text-gray-600">{s.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

export default UploadGuide;