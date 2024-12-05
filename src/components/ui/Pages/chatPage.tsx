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
  
const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState<'chat' | 'upload'>('chat');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(0);
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

    const nextStep = () => {
      setStep((prev) => prev + 1);
    };

  return (
    <div className="chat-page">
        <div className="flex h-screen">
        <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            conversations={conversations}
            loadConversation={loadConversation}
            updateConversationName={updateConversationName}
            deleteConversation={deleteConversation}
            createNewConversation={createNewConversation}
            step = {step}
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
         : <UploadTdrPage step={step} nextStep={nextStep} />}
        </div>
    </div>
  );
};

export default ChatPage;