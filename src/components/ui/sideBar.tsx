"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Edit, Plus, Trash } from 'lucide-react';
import { Card } from './card';
import { Tooltip } from 'react-tooltip';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import UploadedFiles from './uploadedFiles';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  step: number;
  conversations: { id: string; name: string; messages: { text: string; sender: 'user' | 'bot' }[] }[];
  loadConversation: (id: string) => void;
  updateConversationName: (id: string, name: string) => void;
  deleteConversation: (id: string) => void;
  createNewConversation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  conversations, 
  loadConversation, 
  updateConversationName, 
  deleteConversation, 
  createNewConversation 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleEditClick = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setNewName(currentName);
    setDropdownOpenId(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleNameSubmit = (id: string) => {
    if (newName.trim() !== '') {
      updateConversationName(id, newName.trim());
      setEditingId(null);
      toast.success('Nombre de conversación actualizado');
    }
  };

  const handleConversationClick = (id: string) => {
    if (editingId === null) {
      loadConversation(id);
      setActiveConversationId(id);
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Deleting conversation:', id);
    deleteConversation(id);
    setDropdownOpenId(null);

    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
    toast.success('Conversación eliminada');
  };

  const handleCreateNewConversation = () => {
    createNewConversation();
    toast.success('Chat añadido con éxito');
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpenId !== null && !dropdownRef.current?.contains(event.target as Node)) {
        setDropdownOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpenId]);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  return (
    <div className="fixed top-5 left-5 bottom-5 w-80 bg-gray-200 p-6 rounded-2xl flex flex-col">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src="/logo_codexca_big.png" alt="Codexca Logo" className="h-16 p-2 mt-5" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 gap-4 bg-gray-300 p-2 rounded-lg ">
          <TabsTrigger value="chat" className="p-2 text-center bg-gray-300 rounded-lg hover:bg-gray-100">Gestor Documental</TabsTrigger>
          <TabsTrigger value="upload" className="p-2 text-center bg-gray-300 rounded-lg hover:bg-gray-100">Agente de Licitaciones</TabsTrigger>
        </TabsList>

        {/* Contenido de Chats */}
        <TabsContent value="chat" className="p-0">
          <div className="flex flex-grow justify-between items-center mb-4 focus:outline-none">
          <button
            onClick={handleCreateNewConversation}
            className="w-full flex items-center justify-between p-2 bg-gray-300 hover:bg-gray-100 rounded-lg transition"
          >
            <span className="font-semibold">Nuevo Chat</span>
            <Plus className="w-6 h-6 text-gray-700" />
          </button>
          </div>
          <div ref={chatContainerRef} className="overflow-auto no-scrollbar px-6 pl-2 pr-3" style={{ height: '50vh' }}>
          <ul className="flex flex-col w-full">
            {conversations.map((conv) => (
              <Card
              key={conv.id}
              className={classNames(
                'flex-grow w-full p-4 rounded-lg mb-4 cursor-pointer transition-all duration-200',
                {
                  'border-l-4 border-l-blue-500': activeConversationId === conv.id,
                  'bg-white border-l-2 border-l-blue-300': activeConversationId !== conv.id,
                  'border-l-4 border-l-blue-400 shadow-inner': editingId === conv.id,
                }
              )}
              onClick={() => handleConversationClick(conv.id)}
              hoverable={true}
            >
              <li className="flex flex-col">
                <div className="flex justify-between items-center">
                  {editingId === conv.id ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={newName}
                      onChange={handleNameChange}
                      onBlur={() => handleNameSubmit(conv.id)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit(conv.id)}
                      className="flex-grow mr-2 border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 bg-gray-100 rounded transition-all duration-200 ease-in-out"
                      style={{ width: '70%' }}
                      aria-label="Nombre de conversación"
                    />
                  ) : (
                    <span className="text-md font-semibold">{conv.name}</span>
                  )}
                  <div className="flex space-x-1">
                    <div className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <Edit 
                        size={20}
                        className="focus:outline-none" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEditClick(conv.id, conv.name, e); 
                        }}
                        data-tooltip-id={`edit-tooltip-${conv.id}`}
                        data-tooltip-content="Renombrar"
                        aria-label="Renombrar conversación"
                      />
                      <Tooltip id={`edit-tooltip-${conv.id}`} place="top" />
                    </div>
                    <div className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <Trash
                        size={20}
                        className="focus:outline-none" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDeleteClick(conv.id, e); 
                        }}
                        data-tooltip-id={`delete-tooltip-${conv.id}`}
                        data-tooltip-content="Borrar"
                        aria-label="Borrar conversación"
                      />
                      <Tooltip id={`delete-tooltip-${conv.id}`} place="top" />
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-1 break-all">{conv.id}</span>
              </li>
            </Card>
            ))}
          </ul>
          </div>
          {/* Desplegable de Archivos Subidos */}
        </TabsContent>
      </Tabs>
      <UploadedFiles/>
    </div>
  );
};

export default Sidebar;