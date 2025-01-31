import React, { useState, useEffect} from 'react';
import ChatInterface from '../ChatInterface/chatInterface';
import Sidebar from '../Sidebar/sideBar';
import useChatActions from '../ChatInterface/chatActions';
import UploadTdrPage from './uploadTdrPage';
import { StepProvider } from '../UploadTdr/stepContext';


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
    const [uploadStep, setUploadStep] = useState(0);
    const [responseData, setResponseData] = useState<any>(null);
    const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log('apiURL', process.env.NEXT_PUBLIC_API_URL);

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
        <StepProvider 
              initialStep={uploadStep} 
              onStepChange={setUploadStep}
              responseData={responseData}    // Add this line
              setResponseData={setResponseData}  // Add this line
          >
          <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              conversations={conversations}
              loadConversation={loadConversation}
              updateConversationName={updateConversationName}
              deleteConversation={deleteConversation}
              createNewConversation={createNewConversation}
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
            : 
                <UploadTdrPage />
              }
            </StepProvider>
          </div>
        </div>
  );
};

export default ChatPage;