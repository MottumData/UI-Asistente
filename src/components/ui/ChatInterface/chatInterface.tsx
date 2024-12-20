"use client";

import React, { useEffect, useRef } from 'react';
import Message from './message';
import LoadingIndicator from './loadingIndicator';
import MessageList from './messageList';
import PromptSuggestions from './promptSuggestions';
import SettingsButton from './settingsButton';
import MessageInputArea from './messageInputArea';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  type?: 'text' | 'file' | 'html';
  fileName?: string;
  fileUrl?: string;
}

const promptSuggestions = [
  "Dame un listado de proyectos en los que trabajamos en temas de turismo",
  "¿Qué documentos debo incluir en la oferta para cumplir con los requisitos de la licitación?",
  "Necesito un resumen de los términos de referencia del proyecto",
  "¿Cuáles son las fechas clave para la presentación de esta licitación?"
];

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  apiURL: string;
  sendMessage: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setMessages,
  input,
  setInput,
  isLoading,
  setIsLoading,
  apiURL,
  sendMessage,
  handleFileUpload,

}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  

  return (
    <div className="flex flex-col flex-grow ml-80">
      <SettingsButton />
      {messages.length === 0 && (
        <p className="text-center text-lg font-bold p-4 rounded-lg">
          Chani, tu Asistente Documental basado en Inteligencia Artificial. ¿En qué te puedo ayudar?
        </p>
        )}
      <div className="flex-grow overflow-auto no-scrollbar px-8 space-y-4 p-4">
        {messages.length === 0 ? (
          <PromptSuggestions suggestions={promptSuggestions} onSelect={setInput} />
        ) : (
          <MessageList messages={messages} />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white">
        <LoadingIndicator isLoading={isLoading} />
        <MessageInputArea
          input={input}
          setInput={setInput}
          handleFileUpload={handleFileUpload}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatInterface;