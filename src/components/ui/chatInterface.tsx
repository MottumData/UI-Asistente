"use client";

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './sideBar'; // Import Sidebar
import { Button } from './button';
import { Input } from './input';
import { Send, User, Monitor, ArrowLeft, ArrowRight, Paperclip, File, Settings } from 'lucide-react'; 
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from './card';
import { Tooltip } from 'react-tooltip';
import Markdown from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import ReactDOM from 'react-dom'

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

const models = [
  { id: 'model1', name: 'Model 1' },
  { id: 'model2', name: 'Model 2' },
  { id: 'model3', name: 'Model 3' },
];

const ChatInterface: React.FC = () => {
  // State lifted up to centralize conversation management
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [step, setStep] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([defaultConversation]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(defaultConversation.id);
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id);

  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref para auto-scroll

  useEffect(() => {
    if (currentConversationId !== null) {
      const updatedConversations = conversations.map(conv =>
        conv.id === currentConversationId ? { ...conv, messages } : conv
      );
      setConversations(updatedConversations);
    }
  }, [messages, currentConversationId]);

  useEffect(() => {
    scrollToBottom(); // Auto-scroll cada vez que se agregan mensajes
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (input.trim()) {
      let conversationId = currentConversationId;

      // Crear una nueva conversación si no existe
      if (!conversationId) {
        conversationId = uuidv4();
        const newConversation: Conversation = {
          id: conversationId,
          name: `Conversation ${conversations.length + 1}`,
          messages: [], // Inicialmente vacío, se actualizará con el mensaje de usuario
        };
        setConversations([...conversations, newConversation]);
        setCurrentConversationId(conversationId);
      }

      const newMessage: Message = { text: input, sender: 'user' };
      const newMessages: Message[] = [...messages, newMessage];
      setMessages(newMessages);
      setInput('');

      // Crear la estructura del mensaje
      const messagePayload = {
        conversation_id: conversationId,
        prompt: input,
      };

      // Realizar la llamada POST a la API
      fetch('http://localhost:8000/chat-rag/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      })
        .then(response => response.json())
        .then(data => {
          // Manejar la respuesta de la API
          const botMessage: Message = { text: data.response, sender: 'bot' };
          const updatedMessages: Message[] = [...newMessages, botMessage];
          setMessages(updatedMessages);
        })
        .catch(error => {
          console.error('Error al enviar el mensaje:', error);
        });
    }
  };

  const loadConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversation.id);
    }
  };

  const updateConversationName = (id: string, name: string) => {
    setConversations(prevConversations => 
      prevConversations.map(conv =>
        conv.id === id ? { ...conv, name } : conv
      )
    );
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: uuidv4(),
      name: `Conversation ${conversations.length + 1}`,
      messages: [],
    };
    setConversations(prevConversations => [...prevConversations, newConversation]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
  };

  const deleteConversation = (id: string) => {
    setConversations(prevConversations => prevConversations.filter(conv => conv.id !== id));
  
    if (currentConversationId === id) {
      setCurrentConversationId(null);
      setMessages([]);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
  
    // Filtrar archivos permitidos
    const allowedTypes = ['application/pdf', 'text/plain', 'application/json'];
    const filteredFiles = files.filter(file => allowedTypes.includes(file.type));
  
    if (filteredFiles.length === 0) {
      alert('Solo se permiten archivos PDF, TXT o JSON.');
      return;
    }
  
    const formData = new FormData();
    filteredFiles.forEach(file => {
      formData.append('file', file); // Asegúrate de que el nombre 'file' coincide con lo que espera el backend
    });
  
    fetch('http://localhost:8000/upload-file/', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(`Error ${response.status}: ${errorData.detail}`);
          });
        }
        return response.json();
      })
      .then(data => {
        alert('Archivo subido exitosamente');
  
        // Suponiendo que la respuesta contiene una propiedad 'uploadedFiles'
        if (data.uploadedFiles && Array.isArray(data.uploadedFiles)) {
          const uploadedFiles = data.uploadedFiles.map((file: any) => ({
            fileName: file.name,
            fileUrl: file.url,
          }));
  
          setConversations(prevConversations =>
            prevConversations.map(conv =>
              conv.id === currentConversationId
                ? { ...conv, uploadedFiles: [...(conv.uploadedFiles || []), ...uploadedFiles] }
                : conv
            )
          );
        } else {
          throw new Error('La respuesta del servidor no contiene la propiedad "uploadedFiles".');
        }
      })
      .catch(error => {
        console.error('Error al subir el archivo:', error);
        alert(`Hubo un error al subir el archivo: ${error.message}`);
      });
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
            <div className="flex justify-between items-center">
              <select
                value={selectedModel}
                onChange={handleModelChange}
                className="hover:bg-gray-100 rounded-lg focus:outline-none items-center p-4"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <div className="ml-auto p-2 hover:bg-gray-100 rounded-full cursor-pointer mb-10">
                <Settings 
                  className="text-gray-500" 
                  size={24} 
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Configuración"
                />
              </div>
            </div>
            <div className="flex-grow overflow-auto space-y-4 p-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {promptSuggestions.map((suggestion, index) => (
                      <Card key={index} className="cursor-pointer hover:bg-gray-100" onClick={() => setInput(suggestion)}>
                        <CardContent className="flex items-center w-full text-center">
                          <p>{suggestion}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                    {msg.sender === 'bot' && (
                      <div className="flex items-start space-x-2">
                        <div className="rounded-full bg-gray-200 text-black p-2">
                          <Monitor />
                        </div>
                        <div className="rounded-lg p-4 bg-gray-200">
                        <div key={index} className={`message ${msg.sender}`}>
                        <Markdown>{msg.text}</Markdown>
                        </div>
                        </div>
                      </div>
                    )}
                    {msg.sender === 'user' && (
                      <div className="flex items-center space-x-2">
                        {msg.type === 'file' ? (
                          <div className="rounded-lg p-2 max-w-xs bg-blue-500 text-white">
                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                              {msg.fileName}
                            </a>
                          </div>
                        ) : (
                          <div className="rounded-lg p-2 bg-blue-500 text-white">
                            {msg.text}
                          </div>
                        )}
                        <div className="rounded-full bg-blue-500 text-white p-2">
                          <User />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} /> {/* Punto para auto-scroll */}
            </div>
            <div className="left-80 right-0 p-4 bg-white">
              {(currentConversation?.uploadedFiles || []).length > 0 && (
                <div className="mb-2">
                  {(currentConversation?.uploadedFiles || []).map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2 ml-10">
                      <File className="text-gray-500" />
                      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                        {file.fileName}
                      </a>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex space-x-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="p-2 hover:bg-gray-100 rounded-full mt-6">
                    <Paperclip 
                      className="text-gray-500" 
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Subir archivo"
                    />
                  </div>
                  <Tooltip id="tooltip" place="right"/>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload} // Método actualizado
                  accept=".pdf, .txt, .json" // Tipos de archivos permitidos
                />
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-grow rounded-full mt-4"
                />
                <Button onClick={sendMessage} className='mt-4'>
                  <Send />
                </Button>
              </div>
              <div className="flex items-center justify-center mt-4">
                <p className="disclaimer">Este asistente puede cometer errores.</p>
              </div>
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