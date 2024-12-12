// UploadGuide.tsx
import React, { useContext } from 'react';
import { Card, CardContent } from '../card';
import { Check } from 'lucide-react';
import { StepContext } from './stepContext'; // Asegúrate de que la ruta sea correcta

interface UploadGuideProps {}

const steps = [
  { title: 'Seleccionar archivo' },
  { title: 'Verificar documento'},
  { title: 'Agregar metadatos'},
  { title: 'Confirmar y subir'},
  { title: 'Revisión final'},
  { title: 'Proceso completado'},
];

const UploadGuide: React.FC<UploadGuideProps> = () => {
  const { step } = useContext(StepContext);

  return (
    <div className="space-y-4">
      {steps.map((s, index) => {
        const isCompleted = index < step;
        const isCurrent = index === step;
        const isPending = index > step;

        return (
          <Card
            key={index}
            className={`p-4 border rounded-lg flex items-center ${
              isCompleted
                ? 'bg-gray-200 border-gray-500'
                : isCurrent
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300'
            }`}
          >
            {/* Icono del Paso */}
            <div className="flex-shrink-0">
              {isCompleted ? (
                // Paso Completado: Círculo gris con check
                <div className="w-8 h-8 flex items-center justify-center bg-gray-400 text-white rounded-full">
                  <Check size={16} />
                </div>
              ) : isCurrent ? (
                // Paso Actual: Círculo azul relleno con número
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
                  {index + 1}
                </div>
              ) : (
                // Paso Pendiente: Círculo con borde gris y número
                <div className="w-8 h-8 flex items-center justify-center border-2 border-gray-400 rounded-full">
                  {index + 1}
                </div>
              )}
            </div>

            {/* Contenido del Paso */}
            <CardContent className="ml-4">
              <h3
                className={`font-semibold ${
                  isCompleted
                    ? 'text-gray-500'
                    : isCurrent
                    ? 'text-blue-500'
                    : 'text-gray-700'
                }`}
              >
                {s.title}
              </h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UploadGuide;