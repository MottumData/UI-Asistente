// File: SettingsButton.tsx
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import Modal from '../modal';
import { openSettingsInfo } from './chatActions';

const SettingsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    console.log('Botón de configuración clicado');
    openSettingsInfo(setIsModalOpen);
  };

  const handleClose = () => {
    console.log('handleClose llamado');
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-end p-2 rounded-full mt-5 px-8 mb-4 relative z-10">
      {/* Envolver solo el ícono con onClick */}
      <div onClick={handleOpen}>
        <Settings
          className="
            w-6 h-6
            hover:text-gray-700
            active:opacity-75
            transition-opacity
            duration-200
            ease-in-out
          "
          size={24}
          data-tooltip-id="tooltip"
          data-tooltip-content="Configuración"
        />
      </div>
      <Tooltip id="tooltip" place="top" />

      {/* Componente Modal */}
      <Modal isOpen={isModalOpen} onClose={handleClose}>
      <img
          src="/Activa_startups.png" // Reemplaza con la ruta de tu imagen
          alt="Activa Startups"
          className="w-full h-auto mb-4 rounded"
        />
        <h2 className="text-lg font-medium text-center mb-4 text-gray-700 dark:text-gray-200">··ACTIVA STARTUPS·· AYUDAS DIRIGIDAS A IMPULSAR LA INOVACIÓN ABIERTA EN EL MARCO DEL PLAN DE RECUPERACIÓN TRANSFORMACIÓN Y RESILENCIA</h2>
        <p className='text-center'>Proyecto: Sistema IA Generativa para la gestión de licitaciones públicas</p>
        <p className='text-center mt-4'>Desarrollado por Mottum</p>
        <p className='text-center'>Versión 0.1.5</p>
      </Modal>
    </div>
  );
};

export default SettingsButton;