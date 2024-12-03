// File: SendButton.tsx
import React from 'react';
import { SendHorizonal } from 'lucide-react';

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      className="
        mt-4
        p-2
        rounded-full
        focus:outline-none
        transition
        duration-200
        ease-in-out
      "
      aria-label="Enviar mensaje"
      disabled={disabled}
    >
      <SendHorizonal
        className="
          w-6 h-6
          hover:text-gray-700
          active:opacity-75
          transition-opacity
          duration-200
          ease-in-out
        "
      />
    </button>
  );
};

export default SendButton;