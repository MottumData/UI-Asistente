"use client";

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Sidebar/sideBar'; // Import Sidebar
import { Button } from './button';
import {ArrowLeft, ArrowRight} from 'lucide-react'; 
import { v4 as uuidv4 } from 'uuid';
import Message from './message';
import LoadingIndicator from './loadingIndicator';
import MessageList from './messageList';
import PromptSuggestions from './promptSuggestions';
import SettingsButton from './settingsButton';
import UploadedFilesList from './uploadedFilesList';
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

const steps = [
  { title: 'Seleccionar archivo', content: 'Haz clic en "Seleccionar archivo" para elegir el documento que deseas subir.' },
  { title: 'Verificar documento', content: 'Asegúrate de que el documento esté en el formato correcto y no exceda el tamaño máximo permitido.' },
  { title: 'Agregar metadatos', content: 'Añade información relevante como título, descripción y palabras clave.' },
  { title: 'Confirmar y subir', content: 'Revisa toda la información y haz clic en "Subir" para finalizar el proceso.' },
  { title: 'Revisión final', content: 'Verifica que todos los datos sean correctos antes de finalizar.' },
  { title: 'Proceso completado', content: 'Tu documento ha sido subido exitosamente.' },
];

const promptSuggestions = [
  "¿Qué criterios de evaluación se mencionan en los términos de referencia?",
  "¿Qué documentos debo incluir en la oferta para cumplir con los requisitos de la licitación?",
  "¿Puedo pedir una extensión del plazo de la licitación?",
  "¿Cuáles son las fechas clave para la presentación de esta licitación?"
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [step, setStep] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([defaultConversation]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(defaultConversation.id);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiURL = process.env.API_BASE_URL || 'https://api-codexca.greenriver-07b808c1.westus.azurecontainerapps.io';

  const {
    sendMessage,
    loadConversation,
    updateConversationName,
    createNewConversation,
    deleteConversation,
    handleFileUpload,
  } = useChatActions(
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    setMessages,
    input,
    setInput,
    apiURL,
    isLoading,
    setIsLoading
  );

  useEffect(() => {
    if (currentConversationId !== null) {
      const updatedConversations = conversations.map(conv =>
        conv.id === currentConversationId ? { ...conv, messages } : conv
      );
      setConversations(updatedConversations);
    }
  }, [messages, currentConversationId, conversations, setConversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);

  return (
    <div className="flex h-screen">
      {/* Sidebar gets conversations and related handlers as props */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        step={step}
        conversations={conversations}
        loadConversation={loadConversation}
        updateConversationName={updateConversationName}
        deleteConversation={deleteConversation}
        createNewConversation={createNewConversation}
      />
      <div className="flex flex-col flex-grow ml-80">
        {activeTab === 'chat' && (
          <>
            <SettingsButton />
            <div className="flex-grow overflow-auto no-scrollbar px-8 space-y-4 p-4">
              {messages.length === 0 ? (
                <PromptSuggestions suggestions={promptSuggestions} onSelect={setInput} />
              ) : (
                <MessageList messages={messages} />
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="left-80 right-0 p-4 bg-white">
              {currentConversation && currentConversation.uploadedFiles && currentConversation.uploadedFiles.length > 0 && (
                <UploadedFilesList uploadedFiles={currentConversation.uploadedFiles} />
              )}
              <LoadingIndicator isLoading={isLoading} />
              <MessageInputArea
                input={input}
                setInput={setInput}
                handleFileUpload={handleFileUpload}
                sendMessage={sendMessage}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
        {activeTab === 'upload' && (
          <div className="flex-grow p-4">
            <div className="mt-4 flex justify-between">
              <Button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                <ArrowLeft />
              </Button>
              <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1}>
                <ArrowRight />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;