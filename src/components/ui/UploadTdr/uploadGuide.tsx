// UploadGuide.tsx
import React, { useContext } from 'react';
import { Card, CardContent } from '../card';
import { Check } from 'lucide-react';
import { StepContext } from './stepContext'; // Asegúrate de que la ruta sea correcta

interface UploadGuideProps {}

const steps = [
  { title: 'Seleccionar archivo', group: 'Etapa de evaluación' },
  { title: 'Verificar documento', group: 'Etapa de evaluación' },
  { title: 'Agregar metadatos', group: 'Etapa de evaluación' },
  { title: 'Confirmar y subir', group: 'Etapa de elaboración' },
  { title: 'Revisión final', group: 'Etapa de elaboración' },
  { title: 'Proceso completado', group: 'Etapa de elaboración' },
];

const groupClasses: { [key: string]: string } = {
  'Etapa de evaluación': "text-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide mb-2",
  'Etapa de elaboración': "text-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide mb-2",
};

const stepClasses: { [key: string]: { completed: string; current: string; pending: string } } = {
  'Etapa de evaluación': {
    completed: 'border-gray-500',
    current: 'border-blue-500',
    pending: 'border-gray-300',
  },
  'Etapa de elaboración': {
    completed: 'border-gray-500',
    current: 'border-yellow-500',
    pending: 'border-gray-300',
  },
};

const iconClasses: { [key: string]: string } = {
  'Etapa de evaluación': 'bg-blue-500',
  'Etapa de elaboración': 'bg-yellow-500',
};

const UploadGuide: React.FC<UploadGuideProps> = () => {
  const { step } = useContext(StepContext);
  const groups = Array.from(new Set(steps.map((s) => s.group)));

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group}>
          <h2 className={groupClasses[group]}>
            {group}
          </h2>
          {steps
            .filter((s) => s.group === group)
            .map((s, index) => {
              const stepIndex = steps.indexOf(s);
              const isCompleted = stepIndex < step;
              const isCurrent = stepIndex === step;
              const isPending = stepIndex > step;

              const classes = stepClasses[group];
              const cardClass = isCompleted
                ? classes.completed
                : isCurrent
                ? classes.current
                : classes.pending;

              // Obtener la clase del icono según el grupo y el estado
              let iconClass = '';
              if (isCompleted) {
                iconClass = 'bg-gray-400';
              } else if (isCurrent) {
                iconClass = iconClasses[group];
              } else {
                iconClass = 'border-gray-400';
              }

        return (
          <Card
              key={stepIndex} // Usar stepIndex para clave única
              className={`p-4 border rounded-lg flex items-center mb-1 ${cardClass}`} // Usar cardClass
            >
            {/* Icono del Paso */}
            <div className="flex-shrink-0">
              {isCompleted ? (
                // Paso Completado: Círculo gris con check
                <div className="w-8 h-8 flex items-center justify-center bg-gray-400 text-white rounded-full">
                  <Check size={16} />
                </div>
              ) : isCurrent ? (
                // Paso Actual: Círculo color específico con número
                <div className={`w-8 h-8 flex items-center justify-center ${iconClass} text-white rounded-full`}>
                  {stepIndex + 1}
                </div>
              ) : (
                // Paso Pendiente: Círculo con borde gris y número
                <div className={`w-8 h-8 flex items-center justify-center border-2 ${iconClass === 'border-gray-400' ? 'border-gray-400' : 'bg-white'} rounded-full`}>
                  {stepIndex + 1}
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
                    ? group === 'Etapa de evaluación' ? 'text-blue-500' : 'text-yellow-500'
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
    ))}
  </div>
);
};

export default UploadGuide;