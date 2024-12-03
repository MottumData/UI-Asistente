// File: MessageList.tsx
import React from 'react';
import Message from '../ChatInterface/message';

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