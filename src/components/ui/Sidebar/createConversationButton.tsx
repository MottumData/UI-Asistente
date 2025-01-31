import React from 'react';
import { Plus } from 'lucide-react';

{/* En este componente se renderiza el botón para crear un nuevo chat. */}

interface CreateNewConversationButtonProps {
  handleCreateNewConversation: () => void;
}

const CreateNewConversationButton: React.FC<CreateNewConversationButtonProps> = ({
  handleCreateNewConversation,
}) => {
  return (
    <div className="flex flex-grow justify-between items-center mb-4 focus:outline-none">
      <button
        onClick={handleCreateNewConversation}
        className="w-full flex items-center justify-between p-2 bg-gray-300 hover:bg-gray-100 rounded-lg transition"
      >
        <span className="font-semibold">Nuevo Chat</span>
        <Plus className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default CreateNewConversationButton;