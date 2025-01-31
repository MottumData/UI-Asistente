// File: MessageList.tsx
import React from 'react';
import Message from '../ChatInterface/message';

{/* En este componente se renderiza la lista de mensajes, donde se muestran los mensajes enviados por el usuario y el bot. */}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  type?: 'text' | 'file' | 'html';
  fileName?: string;
  fileUrl?: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <>
      {messages.map((msg, index) => (
        <Message key={index} msg={msg} />
      ))}
    </>
  );
};

export default MessageList;