// ChatPage.tsx
import React, { useState, useEffect} from 'react';
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
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(defaultConversation.id);
    const [isLoading, setIsLoading] = useState(false);
    const apiURL = process.env.API_BASE_URL || 'https://api-codexca-h.agreeablesand-549b6711.eastus.azurecontainerapps.io';

    const {
      loadConversation,
      updateConversationName,
      createNewConversation,
      deleteConversation,
      sendMessage,
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
        const currentConv = conversations.find(
          (conv) => conv.id === currentConversationId
        );
        if (currentConv) {
          setMessages(currentConv.messages || []);
        } else {
          setMessages([]);
        }
      }
    }, [currentConversationId]);

    useEffect(() => {
      if (currentConversationId !== null) {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === currentConversationId ? { ...conv, messages } : conv
          )
        );
      }
    }, [messages]);

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
            handleNextStep={() => setStep(step + 1)}
        />
            {activeTab === 'chat' ? 
            <ChatInterface
            messages={messages}
            setMessages={setMessages}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            apiURL={apiURL}
            sendMessage={sendMessage}
            handleFileUpload={handleFileUpload}
          />
         : <UploadTdrPage />}
        </div>
    </div>
  );
};

export default ChatPage;