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
        <FileUpload onFileChange={handleFileUpload} />
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
      <div className="flex items-center justify-center mt-4">
        <p className="disclaimer">Este asistente puede cometer errores.</p>
      </div>
    </>
  );
};

export default MessageInputArea;