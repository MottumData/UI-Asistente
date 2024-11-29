"use client";

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Message from './message';
import LoadingIndicator from './loadingIndicator';
import MessageList from './messageList';
import PromptSuggestions from './promptSuggestions';
import SettingsButton from './settingsButton';
import MessageInputArea from './messageInputArea';
import useChatActions from './chatActions';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  type?: 'text' | 'file' | 'html';
  fileName?: string;
  fileUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  uploadedFiles?: { fileName: string; fileUrl: string }[];
}

const defaultConversation: Conversation = {
  id: uuidv4(),
  name: `Conversación 1`,
  messages: [],
};

const promptSuggestions = [
  "¿Qué criterios de evaluación se mencionan en los términos de referencia?",
  "¿Qué documentos debo incluir en la oferta para cumplir con los requisitos de la licitación?",
  "¿Puedo pedir una extensión del plazo de la licitación?",
  "¿Cuáles son las fechas clave para la presentación de esta licitación?"
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiURL = process.env.API_BASE_URL || 'https://api-codexca.greenriver-07b808c1.westus.azurecontainerapps.io';

  const {
    sendMessage,
    handleFileUpload,
  } = useChatActions(
    [],
    () => {},
    null,
    () => {},
    setMessages,
    input,
    setInput,
    apiURL,
    isLoading,
    setIsLoading
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col flex-grow ml-80">
      <SettingsButton />
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