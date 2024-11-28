"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import ConversationItem from './conversationItem';
import UploadedFiles from './uploadedFiles';
import useSidebarActions from './sidebarActions';
import CreateNewConversationButton from './createConversationButton';

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

  const {
    handleEditClick,
    handleNameChange,
    handleNameSubmit,
    handleConversationClick,
    handleDeleteClick,
    handleCreateNewConversation,
  } = useSidebarActions({
    setEditingId,
    setNewName,
    updateConversationName,
    loadConversation,
    deleteConversation,
    createNewConversation,
    setDropdownOpenId,
    setActiveConversationId,
    chatContainerRef,
    newName,
    editingId,
    activeConversationId, // Pasando activeConversationId al hook
  });
  
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
          <CreateNewConversationButton handleCreateNewConversation={handleCreateNewConversation} />
          <div
            ref={chatContainerRef}
            className="overflow-auto no-scrollbar px-6 pl-2 pr-3"
            style={{ height: '50vh' }}
          >
            <ul className="flex flex-col w-full">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isEditing={editingId === conv.id}
                  newName={newName}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                  handleNameChange={handleNameChange}
                  handleNameSubmit={handleNameSubmit}
                  inputRef={inputRef}
                  activeConversationId={activeConversationId}
                  handleConversationClick={handleConversationClick}
                />
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