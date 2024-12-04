import React, { useMemo } from 'react';
import { Edit, Trash } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { Card } from '../card'; // Asegúrate de que el componente Card está correctamente importado
import classNames from 'classnames';

interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  uploadedFiles?: { fileName: string; fileUrl: string }[];
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  type?: 'text' | 'file' | 'html';
  fileName?: string;
  fileUrl?: string;
}

interface ConversationItemProps {
  conv: Conversation;
  isEditing: boolean;
  newName: string;
  handleEditClick: (id: string, currentName: string, e: React.MouseEvent) => void;
  handleDeleteClick: (id: string, e: React.MouseEvent) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameSubmit: (id: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  activeConversationId: string | null;
  handleConversationClick: (id: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conv,
  isEditing,
  newName,
  handleEditClick,
  handleDeleteClick,
  handleNameChange,
  handleNameSubmit,
  inputRef,
  activeConversationId,
  handleConversationClick,
}) => {
  // Utilizamos useMemo para que estos IDs se generen una sola vez
  const editTooltipId = `edit-tooltip-${conv.id}`;
  const deleteTooltipId = `delete-tooltip-${conv.id}`;

  return (
    <Card
      className={classNames(
        'flex-grow w-full p-4 rounded-lg mb-4 cursor-pointer transition-all duration-200',
        {
          'border-l-4 border-l-blue-500': activeConversationId === conv.id,
          'bg-white border-l-2 border-l-blue-300': activeConversationId !== conv.id,
          'border-l-4 border-l-blue-400 shadow-inner': isEditing,
        }
      )}
      onClick={() => !isEditing && handleConversationClick(conv.id)}
      hoverable={true}
    >
      <li className="flex flex-col">
        <div className="flex justify-between items-center">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={handleNameChange}
              onBlur={() => handleNameSubmit(conv.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNameSubmit(conv.id);
                }
              }}
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
                data-tooltip-id={editTooltipId}
                data-tooltip-content="Renombrar"
                aria-label="Renombrar conversación"
              />
              <Tooltip id={editTooltipId} place="top" />
            </div>
            <div className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Trash
                size={20}
                className="focus:outline-none" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleDeleteClick(conv.id, e); 
                }}
                data-tooltip-id={deleteTooltipId}
                data-tooltip-content="Borrar"
                aria-label="Borrar conversación"
              />
              <Tooltip id={deleteTooltipId} place="top" />
            </div>
          </div>
        </div>
      </li>
    </Card>
  );
};

export default ConversationItem;