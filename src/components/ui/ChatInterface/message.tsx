// File: Message.tsx
import React from 'react';
import { User, Monitor, File } from 'lucide-react';
import Markdown from 'react-markdown';

interface MessageProps {
  msg: {
    text: string;
    sender: 'user' | 'bot';
    type?: 'text' | 'file' | 'html';
    fileName?: string;
    fileUrl?: string;
  };
}

const Message: React.FC<MessageProps> = ({ msg }) => {
  return (
    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      {msg.sender === 'bot' && (
        <div className="flex items-start space-x-2">
          <div className="rounded-full bg-gray-200 text-black p-2">
            <Monitor />
          </div>
          <div className="rounded-lg p-4 bg-gray-200">
            <div className={`message ${msg.sender}`}>
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
  );
};

export default Message;