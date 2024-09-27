"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Edit, Plus, MoreVertical, Trash} from 'lucide-react';
import UploadGuide from './uploadGuide';
import { Card } from './card';
import { Tooltip } from 'react-tooltip';

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
  step, 
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
  };
  
  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpenId(dropdownOpenId === id ? null : id);
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

  return (
    <div className="fixed top-0 left-0 h-full w-80 bg-gray-200 shadow-lg p-4 box-border">
      <div className="flex justify-center mb-4">
        <img src="/logo_codexca_big.png" alt="Codexca Logo" className="h-16 p-2 mb-3 mt-5" />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 gap-4 bg-gray-300 p-2 rounded-lg mb-2">
          <TabsTrigger value="chat" className="p-2 text-center bg-gray-300 rounded-lg hover:bg-gray-100">Asistente Codexca</TabsTrigger>
          <TabsTrigger value="upload" className="p-2 text-center bg-gray-300 rounded-lg hover:bg-gray-100">Preparación de propuesta</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-grow overflow-auto p-4 box-border">
          
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Conversaciones</h3>
          <div className="hover:bg-gray-100 rounded-full p-2">
            <Plus 
              className="cursor-pointer" 
              onClick={createNewConversation} 
              data-tooltip-id="tooltip"
              data-tooltip-content="Nueva Conversación"
            />
          </div>
        </div>
          <ul>
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                className={`p-4 border rounded-lg mb-4 cursor-pointer ${activeConversationId === conv.id ? 'bg-gray-100 border-blue-500' : 'bg-white border-gray-300'}`}
                onClick={() => handleConversationClick(conv.id)}
              >
                <li className="flex justify-between items-center rounded-full">
                  {editingId === conv.id ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={handleNameChange}
                      onBlur={() => handleNameSubmit(conv.id)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit(conv.id)}
                      className="flex-grow mr-2"
                      onClick={(e) => e.stopPropagation()}
                      style={{ width: '70%' }}
                    />
                  ) : (
                    <span>{conv.name}</span>
                  )}
                  <div className="flex space-x-1">
                  <div className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <Edit 
                      size={20}
                      className="focus:outline-none" 
                      onClick={(e) => handleEditClick(conv.id, conv.name, e)}
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Renombrar"
                    />
                  </div>
                  <div className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <Trash
                      size={20}
                      className="focus:outline-none" 
                      onClick={(e) => handleDeleteClick(conv.id, e)}
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Borrar"
                    />
                  </div>
                  <Tooltip id="tooltip" place="right"/>
                </div>
                </li>
              </Card>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="upload" className="flex-grow overflow-auto p-4 box-border">
          <UploadGuide step={step} activeTab={activeTab} setActiveTab={setActiveTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;