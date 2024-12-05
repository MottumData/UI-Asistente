// File: MessageInputArea.tsx
import React from 'react';
import FileUpload from '../fileUpload';
import Input from '../input';
import SendButton from '../sendButton';

interface MessageInputAreaProps {
  input: string;
  setInput: (value: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
  isLoading: boolean;
}

const MessageInputArea: React.FC<MessageInputAreaProps> = ({
  input,
  setInput,
  handleFileUpload,
  sendMessage,
  isLoading,
}) => {
  return (
    <>
      <div className="flex space-x-2">
        {/* <FileUpload onFileChange={handleFileUpload} /> */}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow rounded-full mt-4"
          disabled={isLoading}
          onSubmit={sendMessage}
        />
        <SendButton onClick={sendMessage} disabled={isLoading} />
      </div>
      <div className="flex flex-col items-center justify-center mt-4 space-y-4">
        <p className="disclaimer text-center">
          Aviso: Agente de codexca en pruebas, este asistente puede cometer errores.
        </p>
        {/*<p className="text-center">
          ··ACTIVA STARTUPS·· AYUDAS DIRIGIDAS A IMPULSAR LA INNOVACIÓN ABIERTA EN EL MARCO DEL PLAN DE RECUPERACIÓN TRANSFORMACIÓN Y RESILENCIA
        </p>*/}
      </div>
    </>
  );
};

export default MessageInputArea;