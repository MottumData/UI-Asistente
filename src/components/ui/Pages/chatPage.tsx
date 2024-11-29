// ChatPage.tsx
import React, { useState} from 'react';
import ChatInterface from '../ChatInterface/chatInterface';
import Sidebar from '../Sidebar/sideBar';
import { v4 as uuidv4 } from 'uuid';
import useChatActions from '../ChatInterface/chatActions';
import UploadTdrPage from './uploadTdrPage';

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
  

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState<'chat' | 'upload'>('chat');
    const [step, setStep] = useState(0);
    const [conversations, setConversations] = useState<Conversation[]>([defaultConversation]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(defaultConversation.id);
    const [isLoading, setIsLoading] = useState(false);
    const apiURL = process.env.API_BASE_URL || 'https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io';

    const {
        loadConversation,
        updateConversationName,
        createNewConversation,
        deleteConversation,
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

    console.log('activeTab:', activeTab);

  return (
    <div className="chat-page">
        <div className="flex h-screen">
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
            {activeTab === 'chat' ? <ChatInterface /> : <UploadTdrPage />}
        </div>
    </div>
  );
};

export default ChatPage;